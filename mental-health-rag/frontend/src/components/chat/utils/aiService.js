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

    const context = conversationContext
        .slice(-5)
        .map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
        }));

    const systemPrompt = `You are SAARTHI AI, a compassionate and empathetic mental health support chatbot designed for the Indian context. Your role is to:
- Listen actively and validate emotions without judgment
- Provide emotional support and coping strategies
- Recognize cultural nuances specific to India
- Encourage professional help when needed
- Use warm, supportive language
- Be concise but meaningful (2-4 sentences typically)
${userMood ? `- The user is currently feeling ${userMood}. Address this sensitively.` : ""}
${userName ? `- The user's name is ${userName}. Use it naturally when appropriate.` : ""}

CRITICAL SAFETY RULES:
- If detecting crisis language (suicide, self-harm), immediately provide crisis resources
- Never provide medical diagnoses or treatment plans
- Always encourage professional help for serious concerns
- Be culturally sensitive to Indian family dynamics and social structures

Respond with genuine empathy and practical support.`;

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1000,
                system: systemPrompt,
                messages: [...context, { role: "user", content: userMessage }],
            }),
        });

        const data = await response.json();
        setAiThinking(false);

        if (data.content && data.content[0]) {
            return data.content[0].text;
        }

        return "I'm here for you. Could you tell me more about what you're experiencing?";
    } catch (error) {
        console.error("AI Error:", error);
        setAiThinking(false);
        return "I'm having trouble connecting right now, but I'm still here to listen. How can I support you?";
    }
};
