from typing import Dict, Any, List
from config import STRESS_KEYWORDS, CRITICAL_KEYWORDS

def analyze_query_safety(user_query: str, context_results: List[Dict]) -> Dict[str, Any]:
    """Rule-based safety analysis and response generation."""
    q_lower = user_query.lower()
    
    # Check for critical keywords
    is_critical = any(keyword in q_lower for keyword in CRITICAL_KEYWORDS)
    
    # Calculate stress score
    stress_count = sum(1 for keyword in STRESS_KEYWORDS if keyword in q_lower)
    stress_score = min(10, max(0, 3 + stress_count * 2))
    
    # Generate answer
    if is_critical:
        answer = (
            "I'm really concerned about what you're sharing. If you're in immediate danger, "
            "experiencing thoughts of self-harm, or considering suicide, please:\n\n"
            "1. Call emergency services (911 in US) immediately\n"
            "2. Contact a crisis helpline (988 Suicide & Crisis Lifeline in US)\n"
            "3. Reach out to a trusted person right now\n\n"
            "Your safety is the top priority. Professional help is available 24/7."
        )
    elif context_results:
        answer = (
            "Based on the mental health resources, I recommend:\n"
            "- Practice grounding techniques and mindfulness\n"
            "- Maintain regular sleep and exercise routines\n"
            "- Reach out to supportive people in your life\n"
            "- Consider speaking with a mental health professional\n\n"
            "Remember, these are general suggestions. For personalized advice, consult a qualified professional."
        )
    else:
        answer = (
            "I couldn't find specific information in my knowledge base, but here are some general wellness tips:\n"
            "- Deep breathing exercises can help with immediate stress\n"
            "- Regular physical activity improves mood\n"
            "- Talking to someone you trust can provide support\n"
            "- Professional counseling is valuable for ongoing concerns"
        )
    
    sources = [f"{r['source']}:p{r['page']}" for r in context_results[:3]]
    
    return {
        "answer": answer,
        "stress_score": stress_score,
        "is_too_critical": is_critical,
        "sources": sources
    }
