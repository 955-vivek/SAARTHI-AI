from typing import Dict, Any, List
from config import STRESS_KEYWORDS, CRITICAL_KEYWORDS

# Emotion-specific response templates
EMOTION_RESPONSES = {
    "anxiety": {
        "opening": "I can sense you're feeling anxious right now. Anxiety can feel overwhelming, but you're not alone in this.",
        "tips": [
            "Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8",
            "Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear",
            "Limit caffeine and try chamomile tea or warm milk instead",
            "Write down your worries - sometimes getting them on paper helps reduce their power"
        ]
    },
    "depression": {
        "opening": "I hear that you're going through a difficult time. Depression can make everything feel heavy, but small steps can help.",
        "tips": [
            "Try to get some sunlight today, even if just for 10 minutes",
            "Reach out to one person you trust - you don't have to face this alone",
            "Set one small, achievable goal for today",
            "Be gentle with yourself - recovery takes time"
        ]
    },
    "stress": {
        "opening": "It sounds like you're under a lot of pressure right now. Stress is your body's way of responding to demands.",
        "tips": [
            "Take a 5-minute break to do some stretching or deep breathing",
            "Break your tasks into smaller, manageable chunks",
            "Prioritize what's urgent vs what can wait",
            "Make sure you're eating well and staying hydrated"
        ]
    },
    "loneliness": {
        "opening": "Feeling lonely can be really painful. In India's fast-paced world, many people feel disconnected despite being surrounded by others.",
        "tips": [
            "Reach out to an old friend or family member, even with a simple message",
            "Consider joining a community group or hobby class",
            "Volunteer for a cause you care about - helping others creates connection",
            "Remember that loneliness is temporary, and connections can be rebuilt"
        ]
    },
    "anger": {
        "opening": "I can understand that you're feeling frustrated or angry. These emotions are valid and deserve attention.",
        "tips": [
            "Take a few deep breaths before reacting to any situation",
            "Go for a short walk or do some physical activity to release the tension",
            "Write down what's bothering you without filtering your thoughts",
            "Consider if there's an underlying hurt or fear beneath the anger"
        ]
    },
    "sleep": {
        "opening": "Sleep troubles can affect everything in life. Rest is essential for mental and physical health.",
        "tips": [
            "Try to maintain a consistent sleep schedule, even on weekends",
            "Avoid screens for at least 30 minutes before bed",
            "Create a relaxing bedtime routine - warm bath, light reading, or gentle music",
            "Keep your bedroom cool, dark, and quiet"
        ]
    },
    "relationship": {
        "opening": "Relationship challenges can be emotionally draining. Whether with family, friends, or partners, these issues need care.",
        "tips": [
            "Try to communicate openly without blame - use 'I feel' statements",
            "Give yourself and others space to process emotions",
            "Consider if there are unmet needs you can express",
            "Family counseling or couples therapy can provide neutral ground for discussions"
        ]
    },
    "work": {
        "opening": "Work pressure is a common challenge in India's competitive environment. Your feelings are completely valid.",
        "tips": [
            "Set clear boundaries between work and personal time",
            "Take regular short breaks during work to reset your mind",
            "Talk to your manager or HR if workload is consistently overwhelming",
            "Remember that your worth isn't defined by your productivity"
        ]
    },
    "exam": {
        "opening": "Exam stress is something many Indian students experience intensely. The pressure can feel immense, but you can manage it.",
        "tips": [
            "Create a realistic study schedule with breaks built in",
            "Use active recall and spaced repetition for better retention",
            "Get enough sleep - your brain consolidates learning during rest",
            "Remember: exams measure preparation, not your worth as a person"
        ]
    },
    "general": {
        "opening": "Thank you for sharing how you're feeling. I'm here to support you.",
        "tips": [
            "Practice mindfulness or meditation for just 5 minutes daily",
            "Maintain a routine with regular meals, sleep, and some physical activity",
            "Connect with people who uplift and support you",
            "Consider speaking with a counselor for personalized guidance"
        ]
    }
}

def detect_emotion_category(query: str) -> str:
    """Detect the primary emotional category from the query."""
    q_lower = query.lower()
    
    # Keyword mappings for each category
    categories = {
        "anxiety": ["anxious", "anxiety", "panic", "nervous", "worried", "worry", "fear", "scared", "restless", "uneasy"],
        "depression": ["depressed", "depression", "sad", "hopeless", "empty", "numb", "low", "down", "unhappy", "miserable", "worthless"],
        "stress": ["stressed", "stress", "pressure", "overwhelmed", "burden", "exhausted", "burnt out", "burnout", "too much"],
        "loneliness": ["lonely", "alone", "isolated", "no friends", "no one", "abandoned", "disconnected", "invisible"],
        "anger": ["angry", "anger", "frustrated", "frustration", "irritated", "annoyed", "mad", "furious", "rage"],
        "sleep": ["sleep", "insomnia", "cant sleep", "can't sleep", "tired", "fatigue", "exhausted", "sleepless", "nightmares"],
        "relationship": ["relationship", "breakup", "break up", "boyfriend", "girlfriend", "husband", "wife", "marriage", "divorce", "family", "parents", "partner"],
        "work": ["work", "job", "boss", "office", "career", "colleague", "workplace", "professional"],
        "exam": ["exam", "exams", "test", "board", "boards", "jee", "neet", "upsc", "study", "marks", "grades", "fail", "failed"]
    }
    
    for category, keywords in categories.items():
        if any(keyword in q_lower for keyword in keywords):
            return category
    
    return "general"


def extract_context_insights(context_results: List[Dict]) -> str:
    """Extract relevant insights from RAG context."""
    if not context_results:
        return ""
    
    # Get a brief excerpt from context
    first_context = context_results[0].get("text", "")[:200]
    return first_context


def analyze_query_safety(user_query: str, context_results: List[Dict]) -> Dict[str, Any]:
    """Rule-based safety analysis and dynamic response generation for Indian users."""
    q_lower = user_query.lower()
    
    # Check for critical keywords
    is_critical = any(keyword in q_lower for keyword in CRITICAL_KEYWORDS)
    
    # Calculate stress score based on keywords
    stress_count = sum(1 for keyword in STRESS_KEYWORDS if keyword in q_lower)
    stress_score = min(10, max(0, 3 + stress_count * 2))
    
    # Generate answer based on detected emotion
    if is_critical:
        answer = (
            "Main samajh sakta/sakti hoon ki aap bahut mushkil waqt se guzar rahe hain. "
            "I'm really concerned about what you're sharing. Please know that you are not alone.\n\n"
            "🆘 **Please reach out for help immediately:**\n"
            "• Tele-MANAS: 14416 or 1800-891-4416 (Toll-free, 24/7)\n\n"
            "Please also consider talking to a trusted family member, friend, or teacher. "
            "You matter, and support is available. 🙏"
        )
    else:
        # Detect emotion category and get tailored response
        emotion = detect_emotion_category(user_query)
        response_data = EMOTION_RESPONSES.get(emotion, EMOTION_RESPONSES["general"])
        
        # Build dynamic response
        tips_formatted = "\n".join([f"• {tip}" for tip in response_data["tips"]])
        
        answer = (
            f"{response_data['opening']}\n\n"
            f"💡 **Here are some suggestions that might help:**\n"
            f"{tips_formatted}\n\n"
            f"📞 **If you need to talk to someone:**\n"
            f"• Tele-MANAS: 14416 or 1800-891-4416 (Toll-free, 24/7)\n\n"
            f"Aap akele nahi hain - you're not alone in this. 🙏"
        )
    
    sources = [f"{r['source']}:p{r['page']}" for r in context_results[:3]]
    
    return {
        "answer": answer,
        "stress_score": stress_score,
        "is_too_critical": is_critical,
        "sources": sources
    }
