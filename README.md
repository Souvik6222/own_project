# 🚀 Project Setup

Welcome to the project! Follow these instructions to get up and running.

## 🛠️ Tech Stack & Dependencies

This project is built using a modern AI stack. Here are the key components:

### ⚡ Core Framework
- **FastAPI** (`fastapi`) - High-performance web framework for building APIs.
- **Uvicorn** (`uvicorn`) - Lightning-fast ASI server implementation.
- **Python-Dotenv** (`python-dotenv`) - Loads environment variables from `.env`.
- **Python-Multipart** (`python-multipart`) - Required for file uploads.

### 🤖 AI & LangChain Power
- **LangChain** (`langchain`) - The framework for developing applications powered by LLMs.
- **Google GenAI** (`langchain-google-genai`) - Integration with Google's powerful Gemini models.
- **LangChain Community** (`langchain-community`) - Additional tools and utilities for LangChain.

### 📄 Document Processing
- **PyPDF2** (`PyPDF2`) - robust PDF parsing and text extraction.

### 🧠 Vector Store & Embeddings
- **ChromaDB** (`chromadb`) - Fast, AI-native vector database.
- **Sentence Transformers** (`sentence-transformers`) - State-of-the-art text and image embeddings.

---

## 📦 Installation

Ready to start? You can install all the required dependencies in one go:

```bash
pip install fastapi uvicorn python-dotenv python-multipart langchain langchain-google-genai langchain-community PyPDF2 chromadb sentence-transformers
```

---

## 🔑 API Key Configuration

**Important:** This project requires your own API key to function properly.

1.  **Create a file** named `.env` in the `backend` folder.
2.  **Add your API Key** to the file following the format below:

    ```env
    # .env file
    GOOGLE_API_KEY=your_api_key_here
    ```

> **Security Note:** 🛡️ Never commit your `.env` file to version control (GitHub/GitLab). Ensure it is added to your `.gitignore`.
