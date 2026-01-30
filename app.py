from flask import Flask, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

def emotion_score (user_text): # NLP + Sentimental_analysis + emotion detection by Sarthak P
    pass

def red_zone_check(user_text):
    threshhold = 75
    score = emotion_score(user_text)
    if score >= threshhold:
        return True
    else:
        return False

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    user_text = data['text']

    score = emotion_score(user_text)

    if red_zone_check:
        return jsonify({
            "risk_level": "RED",
            "action": "human_support",
            "emotion_score": score,
            "message": "High emotional distress detected. Human intervention recommended."
        })

    elif score >= 50:
        return jsonify({
            "risk_level": "CONCERN",
            "action": "restricted_gen_ai_and_suggest_human_support",
            "emotion_score": score,
            "message": "User shows signs of emotional concern. Respond with empathy and caution with recommended human support."
        })

    return jsonify({
        "risk_level": "GREEN",
        "action": "full_gen_ai",
        "emotion_score": score,
        "message": "User is emotionally stable. Normal AI interaction allowed."
    })



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)