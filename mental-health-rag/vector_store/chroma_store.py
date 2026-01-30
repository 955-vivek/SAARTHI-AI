from typing import List, Dict
import chromadb
from config import CHROMA_DIR, COLLECTION_NAME, TOP_K_RESULTS
from embeddings import GeminiEmbedder
from utils import load_all_pdfs
from config import DATA_DIR

class MentalHealthVectorStore:
    """Manages ChromaDB vector store for mental health documents."""
    
    def __init__(self, collection_name: str = COLLECTION_NAME):
        self.client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        self.embedder = GeminiEmbedder()
        self.collection_name = collection_name
        self.collection = None
    
    def initialize(self, force_reload: bool = False):
        """Initialize or load the collection."""
        if force_reload:
            try:
                self.client.delete_collection(name=self.collection_name)
            except:
                pass
        
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embedder
        )
        
        # Load documents if collection is empty
        if self.collection.count() == 0:
            print("Loading documents into vector store...")
            self._load_documents()
        else:
            print(f"Collection already has {self.collection.count()} documents")
    
    def _load_documents(self):
        """Load PDFs and add to collection."""
        documents = load_all_pdfs(DATA_DIR)
        if not documents:
            print("Warning: No documents found to load")
            return
        
        ids = [f"doc_{i}" for i in range(len(documents))]
        texts = [doc["text"] for doc in documents]
        metadatas = [{"source": doc["source"], "page": doc["page"]} for doc in documents]
        
        # Add in batches with progress
        batch_size = 50
        total_batches = (len(documents) + batch_size - 1) // batch_size
        
        for batch_num, i in enumerate(range(0, len(documents), batch_size), 1):
            end = min(i + batch_size, len(documents))
            print(f"Adding batch {batch_num}/{total_batches} ({end-i} documents)...")
            
            try:
                self.collection.add(
                    ids=ids[i:end],
                    documents=texts[i:end],
                    metadatas=metadatas[i:end]
                )
            except Exception as e:
                print(f"Error adding batch {batch_num}: {e}")
                continue
        
        print(f"✓ Added {len(documents)} documents to collection\n")
    
    def query(self, query_text: str, k: int = TOP_K_RESULTS) -> List[Dict]:
        """Query the vector store and return results with metadata."""
        if not self.collection:
            raise RuntimeError("Collection not initialized. Call initialize() first.")
        
        results = self.collection.query(
            query_texts=[query_text],
            n_results=k
        )
        
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        
        return [
            {
                "text": doc,
                "source": meta.get("source", "unknown"),
                "page": meta.get("page", 0)
            }
            for doc, meta in zip(documents, metadatas)
        ]
