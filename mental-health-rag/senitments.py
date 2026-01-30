from transformers import pipeline

# Load Model
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Labels & Logic
LABELS = {
    "CRITICAL": {
        "labels": ["suicidal_intent", "self_harm_desire", "planning_to_end_life"],
        "base_score": 85, "scale": 15
    },
    "SEVERE": {
        "labels": ["severe_depression", "hopelessness", "crippling_panic"],
        "base_score": 60, "scale": 25
    },
    "MODERATE": {
        "labels": ["clinical_anxiety", "emotional_exhaustion", "social_isolation"],
        "base_score": 35, "scale": 25
    },
    "MILD": {
        "labels": ["worry_about_upcoming_event", "temporary_sadness", "work_stress"],
        "base_score": 10, "scale": 25
    },
    "SAFE": {
        "labels": ["happy_and_optimistic", "neutral_statement", "seeking_knowledge", "slang_or_joke"],
        "base_score": 0, "scale": 10
    }
}

all_labels = [l for cat in LABELS.values() for l in cat["labels"]]

def get_sentiment_score(text):
    """Calculate sentiment score (0-100) based on text classification."""
    try:
        result = classifier(text, all_labels, multi_label=True)
        scores = dict(zip(result['labels'], result['scores']))
        
        # 1. Identify Best Match
        best_label = max(scores, key=scores.get)
        best_confidence = scores[best_label]
        
        # 2. Map to Category
        category_data = LABELS["SAFE"] # Default
        
        for category, data in LABELS.items():
            if best_label in data["labels"]:
                category_data = data
                break
                
        # 3. Critical Override (Safety Net)
        for critical_label in LABELS["CRITICAL"]["labels"]:
            if scores[critical_label] > 0.6:
                category_data = LABELS["CRITICAL"]
                best_confidence = scores[critical_label]
                break

        # 4. Calculate Final Percentage
        final_percentage = category_data["base_score"] + (best_confidence * category_data["scale"])
        return int(final_percentage)
    except Exception as e:
        print(f"Error in sentiment scoring: {e}")
        return 0

def analyze_sentiment(text):
    """Analyze text and return structured sentiment data."""
    if not text:
        return {
            "risk_level": "GREEN",
            "action": "full_gen_ai",
            "emotion_score": 0,
            "message": "No text provided."
        }

    score = get_sentiment_score(text)
    
    # Determine Status based on score
    # Using the logic from previous implementation attempt
    # CRITICAL/RED: score >= 75 (implied from base_score of CRITICAL being 85)
    # CONCERN: score >= 50
    # GREEN: < 50

    if score >= 75:
        return {
            "risk_level": "RED",
            "action": "human_support",
            "emotion_score": score,
            "message": "High emotional distress detected. Human intervention recommended."
        }
    elif score >= 50:
        return {
            "risk_level": "CONCERN",
            "action": "restricted_gen_ai_and_suggest_human_support",
            "emotion_score": score,
            "message": "User shows signs of emotional concern. Respond with empathy and caution with recommended human support."
        }
    else:
        return {
            "risk_level": "GREEN",
            "action": "full_gen_ai",
            "emotion_score": score,
            "message": "User is emotionally stable. Normal AI interaction allowed."
        }