import os
from typing import List
import chromadb
import google.generativeai as genai
from pypdf import PdfReader

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma")

class GeminiEmbeddingFunction:
	def __init__(self, api_key: str, model: str = "text-embedding-004"):
		genai.configure(api_key=api_key)
		self.model = model

	def __call__(self, input: List[str]) -> List[List[float]]:
		results = []
		for text in input:
			resp = genai.embed_content(model=self.model, content=text)
			results.append(resp["embedding"])
		return results

def _load_pdf_texts(data_dir: str) -> List[str]:
	texts = []
	for fname in os.listdir(data_dir):
		if not fname.lower().endswith(".pdf"):
			continue
		path = os.path.join(data_dir, fname)
		reader = PdfReader(path)
		for page in reader.pages:
			text = (page.extract_text() or "").strip()
			if text:
				texts.append(text)
	return texts

def build_vector_store(collection_name: str = "mental_health") -> chromadb.Collection:
	api_key = os.getenv("GEMINI_API_KEY", "").strip()
	if not api_key:
		raise RuntimeError("GEMINI_API_KEY is required for Gemini embeddings.")
	client = chromadb.PersistentClient(path=PERSIST_DIR)
	embed_fn = GeminiEmbeddingFunction(api_key=api_key)
	collection = client.get_or_create_collection(name=collection_name, embedding_function=embed_fn)
	texts = _load_pdf_texts(DATA_DIR)

	if texts:
		ids = [f"doc_{i}" for i in range(len(texts))]
		collection.upsert(ids=ids, documents=texts, metadatas=[{"source": "pdf"}] * len(texts))
	return collection

def query_collection(collection: chromadb.Collection, query: str, k: int = 5) -> List[str]:
	results = collection.query(query_texts=[query], n_results=k)
	return results.get("documents", [[]])[0]