from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
from typing import Dict, Any
from rag.pipeline import MentalHealthRAG

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
        result = rag_pipeline.query(request.query)
        return result
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
