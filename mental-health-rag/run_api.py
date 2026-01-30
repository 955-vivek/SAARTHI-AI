import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("Mental Health RAG API Server")
    print("=" * 60)
    print("\n🚀 Starting server...")
    print("\n📍 Access points:")
    print("   - Frontend:  http://localhost:8000")
    print("   - API Docs:  http://localhost:8000/docs")
    print("   - Health:    http://localhost:8000/health")
    print("\n⏹  Press Ctrl+C to stop\n")
    print("=" * 60)
    
    uvicorn.run(
        "api.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
