
<h1>🎙️ Text-to-Voice LLM Extension</h1>

<h3>Chrome Extension that Reads Selected Text with AI + Voice</h3>

<p>
<a href="https://python.org" target="_blank">
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
</a>
<a href="https://fastapi.tiangolo.com" target="_blank">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
</a>
<a href="https://ollama.com" target="_blank">
  <img src="https://img.shields.io/badge/Ollama-Llama3-000000?style=for-the-badge&logo=meta&logoColor=white" alt="Ollama">
</a>
<a href="https://developer.chrome.com/docs/extensions/" target="_blank">
  <img src="https://img.shields.io/badge/Chrome-Extension_MV3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension">
</a>
<a href="LICENSE" target="_blank">
  <img src="https://img.shields.io/badge/License-MIT-gold?style=for-the-badge" alt="License">
</a>
</p>

<p>
  <em>Select any text on a webpage, send it to a local LLM, and hear the AI response spoken aloud — all from a beautiful Chrome extension popup.</em>
</p>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🔍 Overview

**Text-to-Voice LLM Extension** is a Chrome extension paired with a lightweight FastAPI backend that:

1. **Captures** selected text from any webpage
2. **Sends** it to a local **Llama 3** model running via **Ollama**
3. **Displays** the AI response in a premium popup UI
4. **Speaks** the response aloud using the browser's **Web Speech API**

Everything runs **100% locally** — no cloud API keys required, no data leaves your machine.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🖱️ **Text Selection** | Select any text on a webpage and send it to the AI |
| 🤖 **Local LLM** | Powered by **Llama 3** via Ollama — fully offline |
| 🔊 **Voice Output** | AI responses spoken aloud using Web Speech API |
| 🎨 **Premium UI** | Neon-themed glassmorphism design with dark/light mode toggle |
| 🔁 **Replay & Stop** | Replay the last voice response or stop mid-speech |
| 🔒 **Privacy** | All processing stays on your local machine |

---

## 🏗 Architecture

```
┌──────────────────────────────────────┐
│        Chrome Extension (MV3)        │
│  ┌────────────┐   ┌───────────────┐ │
│  │ popup.html │   │  popup.cjs    │ │
│  │ popup.css  │   │ (Chrome API + │ │
│  │ (Neon UI)  │   │  Speech API)  │ │
│  └─────┬──────┘   └───────┬───────┘ │
└────────┼───────────────────┼─────────┘
         │   HTTP POST       │
         ▼                   ▼
┌──────────────────────────────────────┐
│         FastAPI Backend (app.py)     │
│  ┌──────────────────────────────┐   │
│  │  POST /ask                    │   │
│  │  { text: "..." }              │   │
│  │         │                     │   │
│  │         ▼                     │   │
│  │  ┌─────────────┐             │   │
│  │  │   Ollama    │             │   │
│  │  │  (Llama 3)  │             │   │
│  │  └─────────────┘             │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **LLM** | Llama 3 (via Ollama) | Local language model inference |
| **Backend** | FastAPI + Uvicorn | REST API server |
| **Frontend** | Chrome Extension (Manifest V3) | Browser popup UI |
| **Voice** | Web Speech API (`SpeechSynthesisUtterance`) | Text-to-speech output |
| **Styling** | TailwindCSS + Custom CSS | Neon glassmorphism dark/light theme |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Installation |
|---|---|
| **Python 3.8+** | [python.org](https://python.org) |
| **Ollama** | [ollama.com](https://ollama.com) — install & run |
| **Llama 3 model** | `ollama pull llama3` |
| **Google Chrome** | Latest version |

### 1️⃣ Install & Pull the Model

```bash
# Install Ollama (follow instructions at ollama.com)
# Then pull Llama 3
ollama pull llama3
```

### 2️⃣ Start the Backend

```bash
# Install Python dependencies
pip install fastapi uvicorn ollama

# Run the server
uvicorn app:app --reload
```

The API will start at **`http://127.0.0.1:8000`**.

### 3️⃣ Load the Chrome Extension

1. Open **`chrome://extensions/`**
2. Enable **Developer mode**
3. Click **"Load unpacked"**
4. Select the `frontend/` folder
5. Pin the extension from the toolbar

### 4️⃣ Use It!

1. **Select text** on any webpage
2. Click the **extension icon**
3. Click **"Process Selection"**
4. 🎧 Listen to the AI response!

---

## ⚙️ How It Works

1. **`popup.cjs`** uses `chrome.scripting.executeScript()` to grab the selected text from the active tab
2. The text is sent as a `POST` request to `http://127.0.0.1:8000/ask`
3. **`app.py`** forwards the text to the local **Ollama Llama 3** model
4. The AI response is returned and displayed in the popup
5. **`SpeechSynthesisUtterance`** reads the response aloud

---

## 📁 Project Structure

```
text-to-voice-llm-extension/
├── app.py                  # FastAPI backend — routes text to Ollama / Llama 3
├── run.txt                 # Quick-start command reference
│
└── frontend/
    ├── manifest.json       # Chrome Extension config (Manifest V3)
    ├── popup.html          # Premium UI — neon gradients, glassmorphism
    ├── popup.css           # Styling — dark/light mode, animations
    ├── popup.cjs           # Extension logic — text capture, speech, API calls
    └── icon.png            # Extension icon
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Is server running?"** | Run `uvicorn app:app --reload` |
| **Ollama not found** | Install from [ollama.com](https://ollama.com) and ensure it's running |
| **Llama 3 not available** | Run `ollama pull llama3` |
| **No text selected** | Highlight text on a webpage before clicking the extension |
| **Voice not working** | Check browser audio permissions; try a different voice |
| **Extension not loading** | Enable Developer mode at `chrome://extensions/` |

---

## 📄 License

MIT License — feel free to modify and use for your own projects.

---

<div align="center">

**Built with ❤️ by Souvik** 🎙️✨

*Your local AI voice assistant — select, process, listen.*

</div>
