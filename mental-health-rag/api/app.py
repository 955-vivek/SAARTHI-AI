from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
from typing import Dict, Any, Optional
from rag.pipeline import MentalHealthRAG
from senitments import analyze_sentiment

app = FastAPI(title="Mental Health RAG API", version="1.0.0")

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG
rag_pipeline = None

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    stress_score: int
    is_too_critical: bool
    sources: list
    risk_level: Optional[str] = "GREEN"
    sentiment_action: Optional[str] = "full_gen_ai"
    sentiment_message: Optional[str] = ""

import asyncio

@app.on_event("startup")
async def startup_event():
    """Initialize RAG pipeline in background to avoid blocking server start"""
    asyncio.create_task(initialize_rag_pipeline())

async def initialize_rag_pipeline():
    global rag_pipeline
    print("Initializing RAG pipeline in background...")
    try:
        # Run blocking initialization in a separate thread
        loop = asyncio.get_event_loop()
        rag_pipeline = await loop.run_in_executor(None, MentalHealthRAG)
        print("✓ RAG pipeline ready")
    except Exception as e:
        print(f"Error initializing RAG pipeline: {e}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "rag_initialized": rag_pipeline is not None
    }

@app.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    """Process a mental health query"""
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        # 1. Analyze Sentiment
        sentiment_result = analyze_sentiment(request.query)
        
        # 2. Get RAG Response
        # We pass the query to RAG. Ideally RAG should also know about sentiment, 
        # but for now we just get the response and overlay our sentiment analysis.
        result = rag_pipeline.query(request.query)
        
        # 3. Merge Sentiment Data
        # Ensure the score from sentiments.py is used if RAG didn't provide one or we want to override
        mapped_result = {
            "answer": result.get("answer", ""),
            "stress_score": sentiment_result["emotion_score"], # Use our new scoring
            "is_too_critical": sentiment_result["risk_level"] == "RED",
            "sources": result.get("sources", []),
            "risk_level": sentiment_result["risk_level"],
            "sentiment_action": sentiment_result["action"],
            "sentiment_message": sentiment_result["message"]
        }
        return mapped_result
    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

# Serve static files (frontend build)
static_path = Path(__file__).parent.parent / "frontend" / "dist"
if static_path.exists():
    @app.get("/")
    async def serve_frontend():
        """Serve the frontend HTML"""
        return FileResponse(static_path / "index.html")
    
    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {
            "message": "Mental Health RAG API",
            "status": "running",
            "docs": "/docs",
            "note": "Static files not found. Access API documentation at /docs"
        }
