from typing import Dict, Any
from vector_store import MentalHealthVectorStore
from rag import SYSTEM_PROMPT, build_rag_prompt, analyze_query_safety, GeminiGenerator

class MentalHealthRAG:
    """Complete RAG pipeline for mental health queries."""
    
    def __init__(self):
        self.vector_store = MentalHealthVectorStore()
        self.vector_store.initialize()
        try:
            self.generator = GeminiGenerator()
        except ValueError:
            print("Warning: Gemini API not configured, using rule-based responses only")
            self.generator = None
    
    def query(self, user_query: str) -> Dict[str, Any]:
        """Process a user query and return structured response."""
        # Retrieve relevant context
        context_results = self.vector_store.query(user_query)
        
        # Build prompt
        user_prompt = build_rag_prompt(user_query, context_results)
        
        # Try LLM generation first
        if self.generator:
            llm_response = self.generator.generate(SYSTEM_PROMPT, user_prompt)
            if llm_response and self._validate_response(llm_response):
                return llm_response
        
        # Fallback to rule-based analysis
        return analyze_query_safety(user_query, context_results)
    
    def _validate_response(self, response: Dict) -> bool:
        """Validate response has required fields."""
        required_fields = ["answer", "stress_score", "is_too_critical", "sources"]
        return all(field in response for field in required_fields)
