export const detectCrisisLanguage = (text) => {
    const crisisKeywords = [
        "suicide",
        "kill myself",
        "end my life",
        "want to die",
        "suicidal",
        "self harm",
        "hurt myself",
        "cutting",
        "death wish",
        "no reason to live",
        "better off dead",
        "can't go on",
        "give up on life",
    ];

    const lowerText = text.toLowerCase();
    return crisisKeywords.some((keyword) => lowerText.includes(keyword));
};

export const getAIResponse = async (
    userMessage,
    userMood,
    conversationContext,
    userName,
    setAiThinking
) => {
    setAiThinking(true);

    try {
        // Construct a query that includes context
        let fullQuery = userMessage;
        const contextParts = [];
        if (userName) contextParts.push(`User Name: ${userName}`);
        if (userMood) contextParts.push(`Current Mood: ${userMood}`);

        if (contextParts.length > 0) {
            fullQuery = `[Context: ${contextParts.join(', ')}] ${userMessage}`;
        }

        const response = await fetch("http://localhost:8000/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: fullQuery
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setAiThinking(false);

        // The backend returns structured data, we want the answer text
        if (data.answer) {
            return data.answer;
        }

        return "I'm here for you. Could you tell me more about what you're experiencing?";
    } catch (error) {
        console.error("AI Error:", error);
        setAiThinking(false);
        return "I'm having trouble connecting to the server. Please ensure the backend is running.";
    }
};
