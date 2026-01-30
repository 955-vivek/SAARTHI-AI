from pathlib import Path
from typing import List
import traceback

def extract_text_from_pdf(pdf_path: Path) -> List[str]:
    """Extract text from a single PDF file with multiple fallback methods."""
    texts = []
    
    # Try pypdf first
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(pdf_path))
        for page_num, page in enumerate(reader.pages):
            try:
                text = (page.extract_text() or "").strip()
                if text:
                    texts.append(text)
            except Exception as e:
                print(f"  Warning: Page {page_num + 1} extraction failed: {e}")
                continue
        
        if texts:
            return texts
    except Exception as e:
        print(f"  pypdf failed: {str(e)[:100]}")
    
    # Fallback to pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(str(pdf_path)) as pdf:
            for page_num, page in enumerate(pdf.pages):
                try:
                    text = (page.extract_text() or "").strip()
                    if text:
                        texts.append(text)
                except Exception:
                    continue
        
        if texts:
            print(f"  ✓ Extracted using pdfplumber fallback")
            return texts
    except ImportError:
        pass
    except Exception as e:
        print(f"  pdfplumber failed: {str(e)[:100]}")
    
    print(f"  ✗ Could not extract text from {pdf_path.name}")
    return []

def load_all_pdfs(data_dir: Path) -> List[dict]:
    """Load all PDFs from directory with metadata."""
    if not data_dir.exists():
        print(f"Warning: {data_dir} does not exist")
        return []
    
    documents = []
    pdf_files = list(data_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"Warning: No PDF files found in {data_dir}")
        return []
    
    print(f"Found {len(pdf_files)} PDF files")
    
    for pdf_file in pdf_files:
        print(f"Processing: {pdf_file.name}")
        texts = extract_text_from_pdf(pdf_file)
        
        for page_num, text in enumerate(texts):
            # Skip very short pages (likely headers/footers only)
            if len(text.strip()) > 50:
                documents.append({
                    "text": text,
                    "source": pdf_file.name,
                    "page": page_num + 1
                })
    
    print(f"\n✓ Successfully loaded {len(documents)} pages from {len(pdf_files)} PDFs\n")
    return documents
