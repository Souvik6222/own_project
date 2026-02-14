<![CDATA[<div align="center">

<h1>🚀 AI-Powered Chrome Extensions Portfolio</h1>

<h3>A Collection of Intelligent Browser Extensions Built with LLMs, RAG, and Modern Web APIs</h3>

<p>
<a href="https://python.org" target="_blank">
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
</a>
<a href="https://fastapi.tiangolo.com" target="_blank">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
</a>
<a href="https://ai.google.dev" target="_blank">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
</a>
<a href="https://python.langchain.com/" target="_blank">
  <img src="https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain">
</a>
<a href="https://developer.chrome.com/docs/extensions/" target="_blank">
  <img src="https://img.shields.io/badge/Chrome-Extensions-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome">
</a>
</p>

<p>
  <em>Three production-ready Chrome extensions showcasing AI/ML integration — from contract analysis to video Q&A to voice-powered assistants.</em>
</p>

</div>

---

## 📦 Projects

This repository contains **three standalone AI-powered Chrome extensions**, each with its own FastAPI backend and dedicated README.

| # | Project | Description | LLM | Key Tech |
|---|---------|-------------|-----|----------|
| 1 | [⚖️ **Legal Agreement Analyzer**](./legal_agreement_analyzer/) | Upload contracts & get AI risk analysis, clause breakdowns, and legal Q&A | Gemini 2.5 Flash | RAG, ChromaDB, HuggingFace, PyPDF2 |
| 2 | [🎙️ **Text-to-Voice LLM Extension**](./text-to-voice-llm-extension/) | Select text on any page → local AI explains it → speaks response aloud | Llama 3 (Ollama) | Web Speech API, Ollama |
| 3 | [🎬 **YouTube RAG Assistant**](./yt_video_chatbot/) | Ask questions about any YouTube video using its transcript | Gemini 2.5 Flash | RAG, ChromaDB, YoutubeLoader |

---

## ⚖️ Legal Agreement Analyzer

> **AI-powered contract risk analysis as a Chrome extension**

<details>
<summary>📖 Click to expand details</summary>

### What It Does
- Upload **PDF/TXT** legal documents or analyze any webpage
- Get a **risk score (0–100%)** with severity-tagged key risk points
- Ask questions in natural language and get **clause-level answers**
- Premium UI with gold/dark theme, glassmorphism, and animations

### Tech Stack
`FastAPI` · `LangChain` · `Gemini 2.5 Flash` · `ChromaDB` · `HuggingFace Embeddings` · `PyPDF2` · `Chrome Extension MV3`

### Quick Start
```bash
cd legal_agreement_analyzer/backend
pip install -r requirements.txt
# Add GOOGLE_API_KEY to .env
uvicorn api:app --reload --port 8000
```
Then load the `extension/` folder in `chrome://extensions/`.

→ [**Full README**](./legal_agreement_analyzer/README.md)

</details>

---

## 🎙️ Text-to-Voice LLM Extension

> **Select text → AI explains it → speaks it aloud — all locally**

<details>
<summary>📖 Click to expand details</summary>

### What It Does
- **Select any text** on a webpage
- Sends it to a **local Llama 3** model (via Ollama) — no cloud needed
- **Displays** the AI response in a neon-themed popup
- **Speaks** the response using the Web Speech API

### Tech Stack
`FastAPI` · `Ollama` · `Llama 3` · `Web Speech API` · `TailwindCSS` · `Chrome Extension MV3`

### Quick Start
```bash
ollama pull llama3
cd text-to-voice-llm-extension
pip install fastapi uvicorn ollama
uvicorn app:app --reload
```
Then load the `frontend/` folder in `chrome://extensions/`.

→ [**Full README**](./text-to-voice-llm-extension/README.md)

</details>

---

## 🎬 YouTube RAG Assistant

> **Chat with any YouTube video using its transcript**

<details>
<summary>📖 Click to expand details</summary>

### What It Does
- Enter a **YouTube Video ID**
- Ask **any question** about the video
- Get **transcript-grounded answers** powered by a full RAG pipeline
- Dark, indigo-themed chat interface with animated message bubbles

### Tech Stack
`FastAPI` · `LangChain` · `Gemini 2.5 Flash` · `ChromaDB` · `HuggingFace Embeddings` · `YoutubeLoader` · `Chrome Extension MV3`

### Quick Start
```bash
cd yt_video_chatbot/backend
pip install fastapi uvicorn python-dotenv langchain langchain-google-genai langchain-community chromadb sentence-transformers
# Add GOOGLE_API_KEY to .env
uvicorn api:app --reload --port 8000
```
Then load the `frontend/` folder in `chrome://extensions/`.

→ [**Full README**](./yt_video_chatbot/README.md)

</details>

---

## 🧠 Shared Concepts & Skills

All three projects demonstrate proficiency in:

| Skill | Description |
|-------|-------------|
| 🤖 **LLM Integration** | Working with both cloud (Gemini) and local (Llama 3) language models |
| 📚 **RAG Pipelines** | Retrieval-Augmented Generation — embedding, vector search, context-grounded answers |
| 🌐 **Chrome Extension Dev** | Manifest V3, popup UIs, `chrome.scripting`, `chrome.storage` |
| ⚡ **FastAPI Backends** | Async Python REST APIs with CORS, file uploads, and structured responses |
| 🗄️ **Vector Databases** | ChromaDB for semantic search over document/transcript chunks |
| 🎨 **Modern UI/UX** | Glassmorphism, gradients, animations, dark themes, responsive design |
| 🔒 **Privacy-First Design** | In-memory processing, local LLM support, no persistent storage |

---

## 📁 Repository Structure

```
own_project/
│
├── legal_agreement_analyzer/     ⚖️  Contract risk analysis extension
│   ├── backend/                      FastAPI + LangChain RAG backend
│   ├── extension/                    Chrome Extension (MV3)
│   ├── sample_agreement.txt          Test legal document
│   └── README.md                     Full documentation
│
├── text-to-voice-llm-extension/  🎙️  Local LLM + voice extension
│   ├── app.py                        FastAPI + Ollama backend
│   ├── frontend/                     Chrome Extension (MV3)
│   └── README.md                     Full documentation
│
├── yt_video_chatbot/             🎬  YouTube transcript Q&A extension
│   ├── backend/                      FastAPI + LangChain RAG backend
│   ├── frontend/                     Chrome Extension (MV3)
│   └── README.md                     Full documentation
│
└── README.md                     📄  ← You are here (this file)
```

---

## 🚀 Getting Started (All Projects)

### Common Prerequisites

- **Python 3.8+** → [python.org](https://python.org)
- **Google Chrome** → Latest version
- **Google API Key** (for Gemini projects) → [Get one here](https://makersuite.google.com/app/apikey)
- **Ollama** (for Text-to-Voice project) → [ollama.com](https://ollama.com)

### General Workflow

1. **Navigate** into the project folder
2. **Install** Python dependencies (`pip install -r requirements.txt` or manually)
3. **Configure** environment variables (`.env` with API keys)
4. **Start** the FastAPI backend (`uvicorn ... --reload`)
5. **Load** the Chrome extension via `chrome://extensions/` → Developer mode → Load unpacked
6. **Use** the extension from the Chrome toolbar!

---

## 📄 License

All projects are licensed under the **MIT License** — feel free to study, modify, and build upon them.

---

<div align="center">

**Crafted with ❤️ — AI Extensions for the Real World**

*From contract analysis to video Q&A to voice assistants — powered by cutting-edge AI.*

</div>
]]>
