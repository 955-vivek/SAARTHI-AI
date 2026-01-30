# 🚀 Setup Guide - Mental Health RAG

## Prerequisites

- Python 3.9 or higher
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- At least 2GB free disk space

## Quick Start

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd mental-health-rag
```

### 2️⃣ Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Set Environment Variables

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**macOS/Linux:**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

**Or create a `.env` file:**
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 5️⃣ Add PDF Documents

Place mental health resource PDFs in the `data/` folder:

```
mental-health-rag/
├── data/
│   ├── mental_health_guide.pdf
│   ├── stress_management.pdf
│   └── ... (add your PDFs here)
```

### 6️⃣ Run the Application

**Web Interface (Recommended):**
```bash
python run_api.py
```

Then open: http://localhost:8000

**CLI Interface:**
```bash
python main.py
```

## 🎯 First Run

On the first run, the system will:
1. Load all PDFs from the `data/` folder
2. Generate embeddings using Gemini
3. Store vectors in ChromaDB (creates `chroma_db/` folder)
4. Start the web server

This may take 2-5 minutes depending on the number of PDFs.

## 🔧 Troubleshooting

### Issue: "GEMINI_API_KEY is required"
**Solution:** Make sure you've set the environment variable correctly.

### Issue: PDF parsing errors
**Solution:** The system will skip corrupted PDFs and continue. Install pdfplumber as fallback:
```bash
pip install pdfplumber
```

### Issue: Embedding errors
**Solution:** Check your API key has access to embedding models. Rate limits may apply for free tier.

### Issue: Port 8000 already in use
**Solution:** Change the port in `run_api.py`:
```python
uvicorn.run("api.app:app", port=8001)
```

## 📦 Optional Configuration

Edit `config.py` to customize:

```python
# Model selection
GEMINI_MODEL = "gemini-1.5-flash"  # or "gemini-1.5-pro"

# RAG parameters
TOP_K_RESULTS = 5  # Number of context chunks
CHUNK_SIZE = 1000  # Text chunk size
```

## 🔄 Rebuilding Vector Store

To force reload all PDFs:

```bash
python -c "from vector_store import MentalHealthVectorStore; MentalHealthVectorStore().initialize(force_reload=True)"
```

## 📱 Accessing from Other Devices

To access from mobile/other computers on same network:

1. Find your IP address:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. Update `run_api.py`:
   ```python
   uvicorn.run("api.app:app", host="0.0.0.0", port=8000)
   ```

3. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:8000
   ```

## 🆘 Support

For issues:
1. Check logs in terminal
2. Verify API key is valid
3. Ensure PDFs are readable
4. Check Python version (3.9+)

## 🔐 Security Notes

- Never commit `.env` file or API keys
- Use `.gitignore` to exclude sensitive files
- Rotate API keys regularly
- Consider rate limiting for production use
