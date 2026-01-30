import os
from pathlib import Path

# Directories
PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
CHROMA_DIR = PROJECT_ROOT / "chroma_db"

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_EMBEDDING_MODEL = "text-embedding-004"  # Will be prefixed with 'models/' automatically

# RAG Configuration
COLLECTION_NAME = "mental_health"
TOP_K_RESULTS = 5
CHUNK_SIZE = 1000

# Stress scoring
STRESS_KEYWORDS = ["stress", "anxious", "panic", "overwhelmed", "depressed", "worried", "nervous"]
CRITICAL_KEYWORDS = ["suicide", "self-harm", "kill myself", "end my life", "hurt others", "imminent danger", "want to die"]
