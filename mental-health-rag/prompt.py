# This file is kept for backward compatibility
# The modular version is in rag/prompt_builder.py

SYSTEM_PROMPT = """You are a mental-health RAG assistant. Use the provided context only.
Output JSON with fields: answer, stress_score (0-10), is_too_critical (true/false), sources.
If user mentions self-harm, suicide, imminent danger, or harm to others, set is_too_critical=true and advise contacting local emergency services or a trusted person immediately.
Be supportive and non-judgmental. Do NOT provide medical diagnosis.
"""

def build_user_prompt(user_query: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks) if context_chunks else "No relevant context found."
    return f"""Context:
{context}

User:
{user_query}

Return JSON only."""