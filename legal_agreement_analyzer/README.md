# ⚖️ Legal Agreement Analyzer

An AI-powered Chrome extension for analyzing legal documents and contracts. Upload PDF or text files of legal agreements and get instant, intelligent answers about clauses, obligations, risks, and terms.

![Legal Agreement Analyzer](https://img.shields.io/badge/Version-1.0-gold?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0-blue?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge)

## ✨ Features

- 📄 **Upload PDF/TXT Documents** - Drag & drop or click to upload legal agreements
- 🤖 **AI-Powered Analysis** - Uses Google Gemini 2.0 for intelligent contract analysis
- 💬 **Natural Language Q&A** - Ask questions in plain English, get clear answers
- 🔍 **Context-Aware Responses** - Answers based only on your uploaded document
- 📊 **Legal-Focused** - Optimized prompts for contract analysis
- 💾 **Persistent Storage** - Your uploaded document persists across sessions
- 🎨 **Premium UI** - Beautiful, professional interface with gold accents

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Google Chrome
- Google API Key (for Gemini)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Google API key:
     ```
     GOOGLE_API_KEY=your_actual_api_key_here
     ```

5. **Run the server:**
   ```bash
   uvicorn api:app --reload --port 8000
   ```

   Server will start at `http://localhost:8000`

### Chrome Extension Setup

1. **Open Chrome Extensions:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)

2. **Load Extension:**
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Pin Extension:**
   - Click the puzzle icon in Chrome toolbar
   - Pin "Legal Agreement Analyzer"

## 📖 How to Use

## 📖 How to Use

### Option 1: Upload Document
- Click "Upload File" toggle
- Click the upload area or drag & drop a PDF/TXT file
- Supported files: Legal contracts, agreements, terms & conditions

### Option 2: Paste Text
- Click "Paste Text" toggle
- Paste any legal text directly into the text area
- Click "Process Text"

### Option 3: Analyze Current Tab (New!)
- Click "Current Tab" toggle
- Navigate to any webpage (e.g. Terms of Service)
- Click "Analyze This Page" to instantly process the page content

### Step 2: Risk Analysis & Q&A
- **Risk Dashboard**: Click "Run Detailed Risk Analysis" to see a visual risk score and key issues.
- **Chat**: Ask specific questions like:
  - "What are the payment terms?"
  - "What are the termination clauses?"
  - "Are there any liability limitations?"

## 🏗️ Architecture

### Backend (FastAPI + LangChain)
```
├── api.py                 # Main FastAPI application
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables
```

**Tech Stack:**
- **FastAPI** - High-performance web framework
- **LangChain** - RAG pipeline orchestration
- **Google Gemini 2.5** - Language model for analysis
- **ChromaDB** - Vector database for document chunks
- **HuggingFace** - Sentence transformers for embeddings
- **PyPDF2** - PDF text extraction

### Frontend (Chrome Extension)
```
├── manifest.json          # Extension configuration
├── popup.html            # UI interface
├── popup.js              # Logic and API calls
└── icon*.png             # Extension icons
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload` | POST | Upload PDF/TXT document |
| `/upload_text` | POST | Upload raw text for analysis |
| `/ask` | POST | Ask question about document |
| `/analyze_risk` | POST | Get detailed risk report (JSON) |
| `/documents` | GET | List uploaded documents |
| `/documents/{id}` | DELETE | Delete a document |

### Example API Usage

**Upload Document:**
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@contract.pdf"
```

**Analyze Risk:**
```bash
curl -X POST http://localhost:8000/analyze_risk \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "contract_pdf",
    "question": "risk"
  }'
```

## 🛠️ Development

### Customize Legal Prompts

Edit the `legal_prompt` in `backend/api.py` to adjust how the AI analyzes documents:

```python
legal_prompt = PromptTemplate(
    template="""
    Your custom legal analysis prompt here...
    """,
    input_variables=["context", "question"]
)
```

### Adjust Chunk Size

Modify document splitting in `api.py`:

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # Increase for longer contexts
    chunk_overlap=200     # Adjust overlap
)
```

### Change Model

Switch to different Gemini model:

```python
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-exp",  # or "gemini-pro"
    temperature=0.2
)
```

## 🎨 Customization

### UI Styling
- Edit `popup.html` to change colors, fonts, layout
- Gold theme (`#ffd700`) used for legal/professional aesthetic
- Dark background for reduced eye strain

### Extension Icon
- Replace `icon16.png`, `icon48.png`, `icon128.png` in `extension/` folder
- Use square images with transparent background

## 📝 Troubleshooting

### "Server not running" Error
- Ensure backend is running: `uvicorn api:app --reload --port 8000`
- Check if port 8000 is available
- Verify no firewall blocking localhost:8000

### "No text could be extracted" Error
- PDF may be image-based (scanned)
- Try OCR on the PDF first
- Convert to searchable PDF or plain text

### Extension Not Loading
- Check Developer mode is enabled
- Reload extension after code changes
- Check Console for errors (F12 in extension popup)

### API Key Issues
- Verify `.env` file exists in `backend/`
- Check API key is valid: [Google AI Studio](https://makersuite.google.com/app/apikey)
- Restart backend after adding key

## 🔐 Security Notes

- Documents are processed in-memory (not saved to disk by default)
- API key stored in `.env` (not committed to git)
- CORS allows all origins for development (restrict in production)
- Consider adding authentication for production use

## 📄 License

MIT License - Feel free to modify and use for your projects

## 🙏 Acknowledgments

- **Google Gemini** for powerful language understanding
- **LangChain** for RAG orchestration
- **ChromaDB** for vector storage
- **HuggingFace** for embeddings

## 🚧 Future Enhancements

- [ ] Support for DOCX files
- [ ] OCR for scanned PDFs
- [ ] Multi-document comparison
- [ ] Export chat history
- [ ] Risk assessment scoring
- [ ] Clause extraction and categorization
- [ ] Integration with legal databases
- [ ] Custom template analysis

---

**Built with AI for Legal Professionals** ⚖️✨

For support or questions, please open an issue on GitHub.
