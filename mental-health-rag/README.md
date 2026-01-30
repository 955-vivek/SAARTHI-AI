# 🧠 Mental Health RAG System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)
![Gemini](https://img.shields.io/badge/Gemini-API-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**An advanced Retrieval-Augmented Generation system for compassionate mental health support**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

This RAG (Retrieval-Augmented Generation) system provides compassionate mental health guidance by:
- 📚 Ingesting mental health resources from PDF documents
- 🔍 Using semantic search to find relevant information
- 🤖 Generating empathetic, context-aware responses with Gemini AI
- 📊 Assessing stress levels (0-10 scale)
- ⚠️ Detecting crisis situations and providing emergency resources

**⚠️ Important:** This is a support tool, not a replacement for professional mental health care.

---

## ✨ Features

### 🎯 Core Capabilities
- **Advanced RAG Pipeline**: ChromaDB + Gemini embeddings for accurate retrieval
- **Stress Assessment**: Automatic stress level scoring (0-10)
- **Crisis Detection**: Identifies mentions of self-harm, suicide, or danger
- **Source Attribution**: Tracks which documents informed each response
- **Fallback System**: Rule-based responses when AI is unavailable

### 🌐 Interfaces
- **Web UI**: Beautiful, responsive chat interface
- **REST API**: Full API for integration with other systems
- **CLI**: Command-line interface for terminal use

### 🔒 Safety Features
- Crisis keyword detection
- Emergency helpline recommendations
- Non-diagnostic language
- Immediate danger protocols

---

## 🚀 Quick Start

### Prerequisites
```bash
Python 3.9+
Gemini API Key
```

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd mental-health-rag
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

2. **Configure API key:**
```bash
# Windows
set GEMINI_API_KEY=your_key_here

# macOS/Linux
export GEMINI_API_KEY=your_key_here
```

3. **Add PDF resources:**
Place mental health PDFs in `data/` folder

4. **Run:**
```bash
# Web interface (recommended)
python run_api.py

# CLI interface
python main.py
```

5. **Access:**
Open http://localhost:8000 in your browser

📖 **Detailed setup:** See [SETUP.md](SETUP.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│              (Web UI / CLI / REST API)                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  RAG Pipeline                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Query      │→ │   Retrieval  │→ │  Generation  │ │
│  │  Processing  │  │   (ChromaDB) │  │   (Gemini)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Response Processing                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │Stress Score  │  │Crisis Check  │  │   Sources    │ │
│  │ Calculation  │  │  Detection   │  │ Attribution  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Project Structure
```
mental-health-rag/
├── api/                    # FastAPI application
│   └── app.py
├── embeddings/             # Gemini embedding function
│   └── gemini_embedder.py
├── rag/                    # RAG pipeline components
│   ├── analyzer.py         # Rule-based analysis
│   ├── gemini_generator.py # LLM generation
│   ├── pipeline.py         # Main orchestrator
│   └── prompt_builder.py   # Prompt templates
├── utils/                  # Utilities
│   └── pdf_loader.py       # PDF processing
├── vector_store/           # ChromaDB management
│   └── chroma_store.py
├── static/                 # Web frontend
│   └── index.html
├── data/                   # PDF documents (user-provided)
├── config.py               # Configuration
├── main.py                 # CLI entry point
├── run_api.py              # API server
└── requirements.txt        # Dependencies
```

---

## 📡 API Documentation

### Endpoints

#### `POST /query`
Process a mental health query.

**Request:**
```json
{
  "query": "I'm feeling stressed and overwhelmed"
}
```

**Response:**
```json
{
  "answer": "Based on the provided materials...",
  "stress_score": 7,
  "is_too_critical": false,
  "sources": ["stress_guide.pdf:p12", "coping.pdf:p5"]
}
```

#### `GET /health`
Check API health status.

**Response:**
```json
{
  "status": "healthy"
}
```

#### `GET /docs`
Interactive API documentation (Swagger UI).

### Example Usage

**Python:**
```python
import requests

response = requests.post(
    "http://localhost:8000/query",
    json={"query": "How can I manage anxiety?"}
)
data = response.json()
print(f"Stress Level: {data['stress_score']}/10")
print(f"Answer: {data['answer']}")
```

**cURL:**
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"query":"Tips for better sleep?"}'
```

---

## 🔧 Configuration

Edit `config.py`:

```python
# API Settings
GEMINI_MODEL = "gemini-1.5-flash"  # or gemini-1.5-pro
GEMINI_EMBEDDING_MODEL = "text-embedding-004"

# RAG Settings
TOP_K_RESULTS = 5          # Context chunks to retrieve
CHUNK_SIZE = 1000          # Text chunk size

# Safety Keywords
CRITICAL_KEYWORDS = [
    "suicide", "self-harm", "kill myself", 
    "end my life", "hurt others"
]
```

---

## 🧪 Testing

```bash
# Test CLI
python main.py

# Test API
python run_api.py
# Then visit http://localhost:8000/docs

# Example queries
- "I'm feeling stressed about work"
- "How can I improve my sleep quality?"
- "What are signs of depression?"
```

---

## 📊 Response Schema

```typescript
interface Response {
  answer: string;           // Generated response
  stress_score: number;     // 0-10 stress level
  is_too_critical: boolean; // Crisis detected
  sources: string[];        // Source documents
}
```

**Stress Levels:**
- 0-3: Low stress (😌)
- 4-6: Moderate stress (😰)
- 7-10: High stress (😢)

---

## 🛡️ Safety & Ethics

### What This System Does
✅ Provides general wellness guidance  
✅ Suggests coping strategies  
✅ Recommends professional help  
✅ Detects crisis situations  

### What This System Does NOT Do
❌ Replace professional therapy  
❌ Provide medical diagnosis  
❌ Prescribe treatment  
❌ Handle active emergencies  

### Crisis Resources
If you or someone you know is in crisis:

🇺🇸 **United States:**
- 988 - Suicide & Crisis Lifeline
- 911 - Emergency Services
- Text "HELLO" to 741741 - Crisis Text Line

🌍 **International:**
- [Find A Helpline](https://findahelpline.com)
- [Befrienders Worldwide](https://www.befrienders.org)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Setup
```bash
pip install -r requirements.txt
pip install black flake8 pytest  # Dev tools
```

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- Gemini AI for embeddings and generation
- ChromaDB for vector storage
- FastAPI for web framework
- Mental health organizations providing resources

---

## 📧 Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: [your-email]
- Project Link: [repository-url]

---

## ⚠️ Disclaimer

This tool is for **informational and educational purposes only**. It is not a substitute for professional mental health care, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.

---

<div align="center">

**Built with ❤️ for mental health awareness**

[⬆ Back to Top](#-mental-health-rag-system)

</div>
