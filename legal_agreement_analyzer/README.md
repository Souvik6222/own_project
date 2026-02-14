
<h1>⚖️ Legal Agreement Analyzer</h1>

<h3>AI-Powered Chrome Extension for Contract Risk Analysis</h3>

<p>
<a href="https://python.org" target="_blank">
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
</a>
<a href="https://fastapi.tiangolo.com" target="_blank">
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
</a>
<a href="https://ai.google.dev" target="_blank">
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI">
</a>
<a href="https://developer.chrome.com/docs/extensions/" target="_blank">
  <img src="https://img.shields.io/badge/Chrome-Extension_MV3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension">
</a>
<a href="https://python.langchain.com/" target="_blank">
  <img src="https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain">
</a>
<a href="LICENSE" target="_blank">
  <img src="https://img.shields.io/badge/License-MIT-gold?style=for-the-badge" alt="License">
</a>
</p>

<p>
  <em>Upload legal contracts (PDF/TXT), paste text, or analyze any webpage — get instant AI-powered risk scores, clause breakdowns, and natural language Q&A.</em>
</p>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Usage Guide](#-usage-guide)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Security](#-security)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🔍 Overview

**Legal Agreement Analyzer** is a production-ready AI tool that lets anyone — from lawyers to everyday users — understand complex legal documents in seconds. It combines a **FastAPI + LangChain RAG backend** with a sleek **Chrome Extension** frontend to deliver:

| Capability | How It Works |
|---|---|
| 📄 **Document Upload** | Drag-and-drop PDF or TXT files into the extension |
| 📋 **Text Paste** | Paste any contract text directly for instant analysis |
| 🌐 **Tab Analysis** | One-click analysis of Terms of Service on any webpage |
| 📊 **Risk Dashboard** | Visual risk gauge (0–100%), severity-tagged key risk points |
| 💬 **Legal Chatbot** | Ask follow-up questions in plain English and get context-aware answers |
| 🔒 **Privacy First** | Documents processed in-memory — nothing stored permanently |

---

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Google Gemini 2.5 Flash** for fast, intelligent contract understanding
- **RAG (Retrieval-Augmented Generation)** pipeline ensures answers are grounded in your document
- Custom legal-domain prompts for clause-level precision
- Context-aware responses with section citations

### 📊 Risk Assessment Engine
- Automated **risk scoring** (0–100) with severity levels (Low / Medium / High / Critical)
- Identifies top 3–5 dangerous, vague, or unfair clauses
- Comprehensive summary of legal obligations
- Structured JSON output for programmatic use

### 🎨 Premium Chrome Extension UI
- Professional gold & dark-blue legal-themed design
- Glassmorphism effects with smooth animations
- Drag-and-drop file upload
- Persistent session storage via Chrome Storage API

### ⚡ Production-Ready Architecture
- Async FastAPI backend with full CORS support
- ChromaDB vector storage with HuggingFace embeddings
- Proper error handling, loading states, and validation
- Clean, extensible codebase

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Chrome Extension                    │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  popup.html  │  │   popup.js   │  │  manifest  │ │
│  │  (Premium UI)│  │  (Logic &    │  │   (MV3)    │ │
│  │              │  │   API calls) │  │            │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────┘ │
│         │                 │                          │
└─────────┼─────────────────┼──────────────────────────┘
          │    HTTP / REST  │
          ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                  FastAPI Backend                     │
│  ┌──────────────────────────────────────────────┐   │
│  │                  api.py                       │   │
│  │  ┌────────────┐  ┌───────────┐  ┌─────────┐ │   │
│  │  │ /upload    │  │ /ask      │  │/analyze │ │   │
│  │  │ /upload_txt│  │ (RAG Q&A) │  │ _risk   │ │   │
│  │  └─────┬──────┘  └─────┬─────┘  └────┬────┘ │   │
│  │        │               │              │      │   │
│  │        ▼               ▼              ▼      │   │
│  │  ┌──────────┐   ┌───────────┐  ┌──────────┐ │   │
│  │  │ PyPDF2   │   │ LangChain │  │ Gemini   │ │   │
│  │  │ Text     │   │ RAG Chain │  │ 2.5 Flash│ │   │
│  │  └──────────┘   └─────┬─────┘  └──────────┘ │   │
│  │                       │                      │   │
│  │                 ┌─────▼─────┐                │   │
│  │                 │ ChromaDB  │                │   │
│  │                 │ + HF      │                │   │
│  │                 │ Embeddings│                │   │
│  │                 └───────────┘                │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **LLM** | Google Gemini 2.5 Flash | Contract analysis & risk assessment |
| **RAG Framework** | LangChain | Orchestration — splitters, retrievers, chains |
| **Vector DB** | ChromaDB | Semantic search over document chunks |
| **Embeddings** | HuggingFace `all-MiniLM-L6-v2` | Sentence-level embeddings |
| **Backend** | FastAPI + Uvicorn | Async REST API server |
| **PDF Parsing** | PyPDF2 | Text extraction from PDF documents |
| **Frontend** | Chrome Extension (Manifest V3) | User interface — popup-based |
| **Styling** | Vanilla CSS (gradients, animations) | Premium UI with glassmorphism |
| **Storage** | Chrome Storage API | Persistent session data in extension |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.8+ |
| Google Chrome | Latest |
| Google API Key | [Get one here](https://makersuite.google.com/app/apikey) |

### 1️⃣ Clone & Navigate

```bash
git clone <your-repo-url>
cd legal_agreement_analyzer
```

### 2️⃣ Backend Setup

```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS / Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env          # Windows
# cp .env.example .env          # macOS / Linux

# Edit .env and add your Google API key
# GOOGLE_API_KEY=your_actual_api_key_here
```

### 3️⃣ Start the Server

```bash
uvicorn api:app --reload --port 8000
```

The API will be available at **`http://localhost:8000`**. Visit `http://localhost:8000/docs` for interactive Swagger documentation.

### 4️⃣ Load Chrome Extension

1. Open **`chrome://extensions/`** in Google Chrome
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `extension/` folder
5. Pin the extension from the puzzle icon in the toolbar

### 5️⃣ Test It Out!

1. Click the extension icon in Chrome
2. Upload the included `sample_agreement.txt`
3. Hit **"Run Detailed Risk Analysis"** for a risk dashboard
4. Ask: *"What are the payment terms?"* in the chatbot

---

## 📡 API Reference

Base URL: `http://localhost:8000`

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | `GET` | API info & available endpoints |
| `/upload` | `POST` | Upload a PDF or TXT file for analysis |
| `/upload_text` | `POST` | Submit raw text for analysis |
| `/ask` | `POST` | Ask a question about a loaded document |
| `/analyze_risk` | `POST` | Run comprehensive risk assessment (returns JSON) |
| `/documents` | `GET` | List all uploaded documents |
| `/documents/{id}` | `DELETE` | Delete a specific document |

### Example Requests

**Upload a document:**
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@contract.pdf"
```

**Ask a question:**
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "contract_pdf",
    "question": "What are the termination clauses?"
  }'
```

**Run risk analysis:**
```bash
curl -X POST http://localhost:8000/analyze_risk \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "contract_pdf",
    "question": "risk"
  }'
```

### Risk Analysis Response Schema

```json
{
  "risk_score": 72,
  "risk_level": "High",
  "key_risks": [
    {
      "title": "Unlimited Liability",
      "description": "Clause 5.2 imposes unlimited liability on the service provider...",
      "severity": "High"
    }
  ],
  "detailed_analysis": "This agreement contains several provisions that..."
}
```

---

## 📖 Usage Guide

### Option 1 — Upload a File
- Click the **"Upload File"** toggle in the extension
- Drag-and-drop or click to select a **PDF** or **TXT** file
- The document is processed and chunked automatically

### Option 2 — Paste Text
- Click the **"Paste Text"** toggle
- Paste any legal text into the text area
- Click **"Process Text"**

### Option 3 — Analyze Current Tab
- Navigate to any webpage (e.g., a Terms of Service page)
- Click the **"Current Tab"** toggle in the extension
- Click **"Analyze This Page"** to extract and process page content

### Risk Dashboard
- Click **"Run Detailed Risk Analysis"** to generate:
  - A visual **risk gauge** (0–100%)
  - Color-coded **key risk points** (High 🔴 / Medium 🟡 / Low 🟢)
  - A **detailed analysis** summary

### Legal Chatbot
Ask natural-language questions such as:
- *"What are the payment terms?"*
- *"Explain the termination clause in simple terms."*
- *"Are there any liability limitations?"*
- *"What obligations does the contractor have?"*

---

## ⚙️ Configuration

### Customize the Legal Prompt

Edit the `legal_prompt` in `backend/api.py`:

```python
legal_prompt = PromptTemplate(
    template="""
    Your custom legal analysis prompt here...
    """,
    input_variables=["context", "question"]
)
```

### Adjust Chunk Size

Modify the `RecursiveCharacterTextSplitter` settings:

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # Increase for longer context windows
    chunk_overlap=200     # Adjust overlap for better continuity
)
```

### Switch LLM Model

```python
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",   # or "gemini-2.0-flash-exp", "gemini-pro"
    temperature=0.3             # Lower = more factual, Higher = more creative
)
```

### UI Theming

- Edit `extension/popup.html` CSS to change the color scheme
- Default palette: **Gold `#ffd700`** accents on a **dark background**

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Server not running"** | Ensure backend is running: `uvicorn api:app --reload --port 8000` |
| **No API key** | Add `GOOGLE_API_KEY` to `backend/.env` — [Get key here](https://makersuite.google.com/app/apikey) |
| **Extension won't load** | Enable Developer mode at `chrome://extensions/` |
| **"No text extracted" from PDF** | PDF may be image-based / scanned — use OCR first |
| **Slow responses** | Check internet connection; reduce document size |
| **Port conflict on 8000** | Use `--port 8001` and update `popup.js` API URL |
| **CORS errors** | Backend already allows all origins; restart the server |

---

## 🔐 Security

- **In-memory processing** — documents are NOT saved to disk
- **API key in `.env`** — excluded from version control via `.gitignore`
- **CORS** — currently allows all origins (restrict `allow_origins` for production)
- **No authentication** — consider adding auth before deploying publicly

---

## 📈 Future Roadmap

- [ ] 📄 DOCX file support
- [ ] 🔍 OCR for scanned / image-based PDFs
- [ ] 📊 Multi-document comparison (side-by-side)
- [ ] 💾 Export chat history & risk reports to PDF
- [ ] 🏷️ Automatic clause extraction & categorization
- [ ] 🔐 User authentication & cloud storage
- [ ] ☁️ Cloud deployment (Railway / Heroku / AWS)
- [ ] 🌍 Multi-language support
- [ ] 🛒 Chrome Web Store publication

---

## 📝 Example Use Cases

| Domain | What You Can Analyze |
|--------|---------------------|
| **Software Licenses** | Licensing restrictions, termination conditions, liability limitations |
| **Employment Contracts** | Compensation terms, non-compete clauses, benefits |
| **NDAs** | Confidentiality scope, exclusions, obligations |
| **Lease Agreements** | Payment schedules, maintenance responsibilities, early termination |
| **SaaS / Service Agreements** | SLAs, liability caps, deliverables |
| **Terms of Service** | Data usage, user rights, dispute resolution |

---

## 📁 Project Structure

```
legal_agreement_analyzer/
├── backend/
│   ├── api.py                 # FastAPI backend — RAG pipeline, risk engine
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment variable template
│   └── make_icons.py          # Utility to generate extension icons
│
├── extension/
│   ├── manifest.json          # Chrome Extension config (Manifest V3)
│   ├── popup.html             # Premium UI — gold/dark theme, animations
│   ├── popup.js               # Extension logic — upload, chat, risk display
│   ├── icon16.png             # Extension icon (16×16)
│   ├── icon48.png             # Extension icon (48×48)
│   ├── icon128.png            # Extension icon (128×128)
│   └── ICON_README.txt        # Icon generation notes
│
├── sample_agreement.txt       # Sample legal agreement for testing
├── index.html                 # Standalone web interface (optional)
├── PROJECT_SUMMARY.md         # Detailed project summary
├── .gitignore                 # Git ignore rules
└── README.md                  # ← You are here
```

---

## 🙏 Acknowledgments

- [**Google Gemini**](https://ai.google.dev/) — Powerful language understanding
- [**LangChain**](https://python.langchain.com/) — RAG orchestration framework
- [**ChromaDB**](https://www.trychroma.com/) — Open-source vector database
- [**HuggingFace**](https://huggingface.co/) — Sentence transformer embeddings
- [**FastAPI**](https://fastapi.tiangolo.com/) — High-performance Python web framework

---

## 📄 License

This project is licensed under the **MIT License** — feel free to modify and use for your own projects.

---

<div align="center">

**Built with ❤️ for Legal Professionals** ⚖️✨

*Understand any contract in seconds — powered by AI.*

</div>
