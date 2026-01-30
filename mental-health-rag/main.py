import json
from rag.pipeline import MentalHealthRAG

def main():
    """CLI interface for mental health RAG."""
    print("=" * 60)
    print("Mental Health Support Assistant")
    print("=" * 60)
    print("Initializing RAG system...\n")
    
    rag = MentalHealthRAG()
    
    print("Ready! Type 'quit' to exit.\n")
    
    while True:
        query = input("\n🧠 You: ").strip()
        
        if query.lower() in ['quit', 'exit', 'q']:
            print("\nTake care! Remember, professional help is always available.")
            break
        
        if not query:
            continue
        
        print("\n💭 Processing...\n")
        result = rag.query(query)
        
        print(f"🤖 Assistant:\n{result['answer']}\n")
        print(f"📊 Stress Score: {result['stress_score']}/10")
        
        if result['is_too_critical']:
            print("⚠️  CRITICAL: Immediate help recommended")
        
        if result.get('sources'):
            print(f"📚 Sources: {', '.join(result['sources'])}")

if __name__ == "__main__":
    main()