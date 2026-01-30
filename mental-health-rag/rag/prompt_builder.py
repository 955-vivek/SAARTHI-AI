from typing import List, Dict

SYSTEM_PROMPT = """You are a compassionate mental health support assistant. 

**Important Guidelines:**
- Use ONLY the provided context to answer
- Be supportive, empathetic, and non-judgmental
- NEVER provide medical diagnosis or replace professional help
- If user mentions self-harm, suicide, or imminent danger, prioritize safety

**Response Format (JSON only):**
{
  "answer": "Your supportive response here",
  "stress_score": 0-10 (0=calm, 10=severe distress),
  "is_too_critical": true/false (true if immediate help needed),
  "sources": ["source1:page1", "source2:page2"]
}

**Crisis Detection:**
Set is_too_critical=true if user mentions: suicide, self-harm, hurting others, imminent danger.
When critical, advise immediate contact with emergency services or crisis helpline.
"""

def build_rag_prompt(user_query: str, context_results: List[Dict]) -> str:
    """Build the complete prompt with context."""
    if context_results:
        context_blocks = []
        for idx, result in enumerate(context_results, 1):
            context_blocks.append(
                f"[Context {idx}] (Source: {result['source']}, Page: {result['page']})\n{result['text']}"
            )
        context_text = "\n\n".join(context_blocks)
    else:
        context_text = "No relevant context found in the knowledge base."
    
    return f"""**Context:**
{context_text}

**User Question:**
{user_query}

**Instructions:** Respond with JSON only. Base your answer on the context provided."""
