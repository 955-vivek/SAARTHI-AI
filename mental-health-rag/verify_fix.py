
print("Attempting to import onnxruntime directly (before chromadb)...")
try:
    import onnxruntime
    print("onnxruntime imported successfully.")
except ImportError as e:
    print(f"onnxruntime import failed: {e}")
    # Print detailed traceback if possible
    import traceback
    traceback.print_exc()
    exit(1)

import chromadb
from chromadb.utils import embedding_functions

try:
    print("Attempting to initialize DefaultEmbeddingFunction...")
    ef = embedding_functions.DefaultEmbeddingFunction()
    print("DefaultEmbeddingFunction initialized successfully.")
    print("VERIFICATION SUCCESS")
except Exception as e:
    print(f"VERIFICATION FAILED: {e}")
