from typing import List
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL

class GeminiEmbedder:
    """Gemini embedding function for ChromaDB."""
    
    def __init__(self, api_key: str = GEMINI_API_KEY, model: str = GEMINI_EMBEDDING_MODEL):
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required")
        genai.configure(api_key=api_key)
        # Ensure model name has correct prefix
        self.model = f"models/{model}" if not model.startswith("models/") else model
        print(f"Initialized embedder with model: {self.model}")
    
    def __call__(self, input: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts (for documents)."""
        embeddings = []
        for idx, text in enumerate(input):
            try:
                # Truncate very long texts
                text_truncated = text[:10000] if len(text) > 10000 else text
                
                resp = genai.embed_content(
                    model=self.model,
                    content=text_truncated,
                    task_type="retrieval_document"
                )
                embeddings.append(resp["embedding"])
            except Exception as e:
                print(f"Embedding error for doc {idx}: {e}")
                # Return zero vector on error (768 dims for text-embedding-004)
                embeddings.append([0.0] * 768)
        return embeddings
    
    def embed_query(self, input: str) -> List[float]:
        """Generate embedding for a single query text (for retrieval)."""
        try:
            # Truncate very long texts
            text_truncated = input[:10000] if len(input) > 10000 else input
            
            resp = genai.embed_content(
                model=self.model,
                content=text_truncated,
                task_type="retrieval_query"
            )
            return resp["embedding"]
        except Exception as e:
            print(f"Query embedding error: {e}")
            # Return zero vector on error (768 dims for text-embedding-004)
            return [0.0] * 768

