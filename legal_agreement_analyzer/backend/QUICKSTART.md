# Legal Agreement Analyzer - Quick Start Guide

## 🚀 Installation in 3 Steps

### 1️⃣ Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your Google API key

# Start server
uvicorn api:app --reload --port 8000
```

### 2️⃣ Get Google API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste into `backend/.env`:
   ```
   GOOGLE_API_KEY=your_key_here
   ```

### 3️⃣ Install Chrome Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `extension` folder
5. Pin the extension (puzzle icon → pin "Legal Agreement Analyzer")

## ✅ You're Ready!

Click the extension icon and:
1. Upload a legal document (PDF or TXT)
2. Ask questions about it
3. Get AI-powered answers

## 📝 Example Questions

- "What are the payment terms?"
- "What are the termination conditions?"
- "Are there any liability limitations?"
- "What are the key risks?"

## 🆘 Troubleshooting

**"Server not running"** → Make sure backend is running on port 8000

**"No text extracted"** → PDF might be scanned, convert to searchable PDF first

**Extension not loading** → Check Developer mode is enabled

---

For detailed documentation, see README.md
