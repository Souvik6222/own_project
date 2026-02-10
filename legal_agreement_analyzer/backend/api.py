from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import tempfile
from typing import Optional

load_dotenv()

# PDF and text processing
import PyPDF2
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda

app = FastAPI(title="Legal Agreement Analyzer")

# CORS for Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM and embeddings
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Store for uploaded documents (in-memory for now)
document_store = {}

# Legal-focused prompt
legal_prompt = PromptTemplate(
    template="""
You are an expert legal assistant specializing in contract analysis.
Analyze the provided legal agreement context and answer the user's question clearly and accurately.

**Instructions:**
- Answer ONLY based on the provided contract context
- Highlight important clauses, obligations, risks, or rights
- Use plain language to explain legal terms
- If the context is insufficient, say: "I cannot find this information in the uploaded agreement."
- Be precise and cite specific sections when possible

**Contract Context:**
{context}

**Question:** {question}

**Answer:**
""",
    input_variables=["context", "question"]
)

parser = StrOutputParser()

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    if not text.strip():
        raise ValueError("No text could be extracted from the PDF")
    
    return text

class Query(BaseModel):
    document_id: str
    question: str

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF or text file for analysis"""
    try:
        # Validate file type
        if not file.filename.endswith(('.pdf', '.txt')):
            raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            # Extract text
            if file.filename.endswith('.pdf'):
                text = extract_text_from_pdf(tmp_path)
            else:
                text = content.decode('utf-8')
            
            if not text.strip():
                raise ValueError("Document appears to be empty")
            
            # Split into chunks
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", ". ", " ", ""]
            )
            chunks = splitter.create_documents([text])
            
            # Create vector store
            vector_store = Chroma.from_documents(
                documents=chunks,
                embedding=embeddings
            )
            
            # Generate document ID
            doc_id = file.filename.replace('.', '_').replace(' ', '_')
            
            # Store the vector store and text
            document_store[doc_id] = {
                'vector_store': vector_store,
                'filename': file.filename,
                'text': text,  # Store full text for analysis
                'text_length': len(text),
                'num_chunks': len(chunks)
            }
            
            return {
                "document_id": doc_id,
                "filename": file.filename,
                "text_length": len(text),
                "num_chunks": len(chunks),
                "message": "Document uploaded and processed successfully"
            }
            
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@app.post("/analyze_risk")
def analyze_risk_assessment(q: Query):
    """Perform a comprehensive risk analysis on the document"""
    import json
    try:
        if q.document_id not in document_store:
            raise HTTPException(status_code=404, detail="Document not found")
            
        doc_data = document_store[q.document_id]
        full_text = doc_data['text']
        
        # Truncate text if too long for one context window (approx 20k chars safety limit for quick analysis)
        # Gemini 2.5 Flash has a large window, but let's be safe and efficient
        analysis_text = full_text[:40000] 
        
        risk_prompt = """
        You are a senior legal risk assessor. Analyze the provided legal agreement and output a text analysis in STRICT JSON format.
        
        Analyze the contract for:
        1. Overall Risk Score (0-100, where 100 is extremely risky/unfair).
        2. Identify top 3-5 specific Key Risk Points (clauses that are dangerous, vague, or unfair).
        3. A detailed summary of the legal obligations.
        
        Output MUST be valid JSON with this exact structure:
        {
            "risk_score": <integer 0-100>,
            "risk_level": "<string: Low, Medium, High, or Critical>",
            "key_risks": [
                {
                    "title": "<short title of risk>",
                    "description": "<explanation of why it is risky>",
                    "severity": "<string: High/Medium/Low>"
                }
            ],
            "detailed_analysis": "<string: A comprehensive summary paragraph>"
        }

        Contract Text:
        """
        
        final_prompt = risk_prompt + analysis_text
        
        # Get response from LLM
        response = llm.invoke(final_prompt)
        content = response.content
        
        # Clean markdown code blocks if present
        if "```json" in content:
            content = content.replace("```json", "").replace("```", "")
        elif "```" in content:
            content = content.replace("```", "")
            
        return json.loads(content)
        
    except Exception as e:
        print(f"Risk analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/ask")
def ask_question(q: Query):
    """Ask a question about the uploaded document"""
    try:
        # Check if document exists
        if q.document_id not in document_store:
            raise HTTPException(status_code=404, detail="Document not found. Please upload a document first.")
        
        doc_data = document_store[q.document_id]
        vector_store = doc_data['vector_store']
        
        # Create retriever
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        
        # Build RAG chain
        parallel_chain = RunnableParallel({
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough()
        })
        
        rag_chain = parallel_chain | legal_prompt | llm | parser
        
        # Get answer
        answer = rag_chain.invoke(q.question)
        
        return {
            "answer": answer,
            "document_id": q.document_id,
            "filename": doc_data['filename']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.get("/documents")
def list_documents():
    """List all uploaded documents"""
    return {
        "documents": [
            {
                "document_id": doc_id,
                "filename": data['filename'],
                "text_length": data['text_length'],
                "num_chunks": data['num_chunks']
            }
            for doc_id, data in document_store.items()
        ]
    }

@app.delete("/documents/{document_id}")
def delete_document(document_id: str):
    """Delete an uploaded document"""
    if document_id not in document_store:
        raise HTTPException(status_code=404, detail="Document not found")
    
    del document_store[document_id]
    return {"message": f"Document {document_id} deleted successfully"}

@app.get("/")
def root():
    return {
        "message": "Legal Agreement Analyzer API",
        "version": "1.0",
        "endpoints": {
            "/upload": "POST - Upload PDF/TXT document",
            "/ask": "POST - Ask question about document",
            "/analyze_risk": "POST - Get comprehensive risk report",
            "/documents": "GET - List uploaded documents",
            "/documents/{id}": "DELETE - Delete document"
        }
    }
