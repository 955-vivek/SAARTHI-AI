import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Send, Heart, Smile, MessageCircle, Settings, Clock, TrendingUp, Moon, Sun, BookOpen, User, X, ChevronDown, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

export default function EnhancedMentalHealthChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm SAARTHI AI, your compassionate mental health companion. I'm here to listen without judgment. How are you feeling today?",
            sender: "bot",
            timestamp: new Date(),
            mood: null,
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showMoodTracker, setShowMoodTracker] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [conversationContext, setConversationContext] = useState([]);
    const [sessionStartTime] = useState(new Date());
    const [aiThinking, setAiThinking] = useState(false);
    const [showResources, setShowResources] = useState(false);
    const [userName, setUserName] = useState("");
    const [showNamePrompt, setShowNamePrompt] = useState(true);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [inputText]);

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const moods = [
        { emoji: "😊", label: "Happy", value: "happy", color: "from-green-400 to-emerald-500" },
        { emoji: "😌", label: "Calm", value: "calm", color: "from-blue-400 to-cyan-500" },
        { emoji: "😔", label: "Sad", value: "sad", color: "from-blue-500 to-indigo-600" },
        { emoji: "😰", label: "Anxious", value: "anxious", color: "from-yellow-400 to-orange-500" },
        { emoji: "😡", label: "Angry", value: "angry", color: "from-red-400 to-rose-600" },
        { emoji: "😴", label: "Tired", value: "tired", color: "from-purple-400 to-violet-500" },
    ];

    const mentalHealthResources = [
        {
            title: "Tele-MANAS",
            description: "National Tele Mental Health Programme",
            phone: "14416",
            url: "https://www.telemanas.mohfw.gov.in/",
            icon: "🧑‍⚕️",
        },
        {
            title: "NIMHANS Helpline",
            description: "24/7 Mental Health Support",
            phone: "080-46110007",
            url: "https://nimhans.ac.in/",
            icon: "🏥",
        },
        {
            title: "iCall",
            description: "Psychosocial Helpline",
            phone: "9152987821",
            url: "https://icallhelpline.org/",
            icon: "📞",
        },
        {
            title: "Vandrevala Foundation",
            description: "Mental Health Support",
            phone: "1860-2662-345",
            url: "https://www.vandrevalafoundation.com/",
            icon: "💚",
        },
    ];

    const getAIResponse = async (userMessage, userMood) => {
        setAiThinking(true);

        const context = conversationContext.slice(-5).map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
        }));

        const systemPrompt = `You are SAARTHI AI, a compassionate and empathetic mental health support chatbot designed for the Indian context. Your role is to:
- Listen actively and validate emotions without judgment
- Provide emotional support and coping strategies
- Recognize cultural nuances specific to India
- Encourage professional help when needed
- Use warm, supportive language
- For Green Zone users: Can suggest some Breathing exersices and meditation techniques, and prefer chanting of holynames and God's names which is sound meditation
- For Moderate users: Can suggest some Breathing exersices and meditation techniques, and prefer chanting of holynames and God's names which is sound meditation and for some human support also like tele-manas and other helplines
- Be concise but meaningful (2-4 sentences typically)
${userMood ? `- The user is currently feeling ${userMood}. Address this sensitively.` : ''}
${userName ? `- The user's name is ${userName}. Use it naturally when appropriate.` : ''}

CRITICAL SAFETY RULES:
- If detecting crisis language (suicide, self-harm), immediately provide crisis resources
- Never provide medical diagnoses or treatment plans
- Always encourage professional help for serious concerns
- Be culturally sensitive to Indian family dynamics and social structures

Respond with genuine empathy and practical support.`;

        try {
            const response = await fetch("http://localhost:8000/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: userMessage
                }),
            });

            const data = await response.json();
            setAiThinking(false);

            if (data.risk_level === "RED" && data.sentiment_message) {
                // Optionally handle critical/red zone in UI if needed, for now just returning answer
                // You could set a state here to show the alert message
                console.log("Critical Sentiment Detected:", data.sentiment_message);
            }

            if (data.answer) {
                return data.answer;
            }

            return "I'm here for you. Could you tell me more about what you're experiencing?";
        } catch (error) {
            console.error("AI Error:", error);
            setAiThinking(false);
            return "I'm having trouble connecting right now, but I'm still here to listen. How can I support you?";
        }
    };

    const detectCrisisLanguage = (text) => {
        const crisisKeywords = [
            "suicide", "kill myself", "end my life", "want to die", "suicidal",
            "self harm", "hurt myself", "cutting", "death wish", "no reason to live",
            "better off dead", "can't go on", "give up on life"
        ];

        const lowerText = text.toLowerCase();
        return crisisKeywords.some(keyword => lowerText.includes(keyword));
    };

    const handleClearChat = () => {
        const confirmClear = window.confirm("Are you sure you want to clear this chat session?");
        if (!confirmClear) return;

        setMessages([
            {
                id: Date.now(),
                text: `Chat cleared. I'm here again whenever you want to talk${userName ? `, ${userName}` : ""}. 💛`,
                sender: "bot",
                timestamp: new Date(),
                mood: null,
            },
        ]);

        setConversationContext([]);
        setCurrentMood(null);
        setShowSettings(false);
    };


    const handleSendMessage = useCallback(async () => {
        if (!inputText.trim()) return;

        const isCrisis = detectCrisisLanguage(inputText);

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: "user",
            timestamp: new Date(),
            mood: currentMood,
        };

        setMessages((prev) => [...prev, userMessage]);
        setConversationContext(prev => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        // Get AI response
        const aiResponse = await getAIResponse(inputText, currentMood);

        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: "bot",
                timestamp: new Date(),
                type: isCrisis ? "crisis" : "normal",
            };

            setMessages((prev) => [...prev, botMessage]);
            setConversationContext(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 300);
    }, [inputText, currentMood, conversationContext]);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    const handleMoodSelect = (mood) => {
        setCurrentMood(mood.value);
        setShowMoodTracker(false);

        const moodMessage = {
            id: Date.now(),
            text: `Mood updated: ${mood.label} ${mood.emoji}`,
            sender: "system",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, moodMessage]);
    };

    const handleNameSubmit = () => {
        if (userName.trim()) {
            setShowNamePrompt(false);
            const welcomeMessage = {
                id: Date.now(),
                text: `Nice to meet you, ${userName}! I'm glad you're here. Remember, this is a safe space where you can express yourself freely. What's on your mind today?`,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, welcomeMessage]);
        }
    };

    const memoizedMessages = useMemo(() => {
        return messages.map((message) => (
            <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" :
                    message.sender === "system" ? "justify-center" : "justify-start"
                    } mb-6 animate-fade-in`}
            >
                {message.sender === "bot" && (
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${darkMode ? 'bg-gradient-to-br from-amber-600 to-orange-700' : 'bg-gradient-to-br from-amber-200 to-orange-300'
                        } flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 shadow-md`}>
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-amber-100' : 'text-amber-800'}`} />
                    </div>
                )}

                {message.sender === "system" && (
                    <div className={`px-4 py-2 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-stone-200 text-stone-600'
                        } flex items-center gap-2`}>
                        <CheckCircle className="w-3 h-3" />
                        {message.text}
                    </div>
                )}

                {message.sender !== "system" && (
                    <div
                        className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"
                            } max-w-[75%] sm:max-w-[65%]`}
                    >
                        <div
                            className={`px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-md ${message.sender === "user"
                                ? darkMode
                                    ? "bg-gradient-to-br from-amber-700 to-orange-800 text-amber-50 rounded-br-sm"
                                    : "bg-gradient-to-br from-amber-600 to-orange-700 text-amber-50 rounded-br-sm"
                                : message.type === "crisis"
                                    ? darkMode
                                        ? "bg-red-900/50 text-red-100 rounded-bl-sm border border-red-700 shadow-lg"
                                        : "bg-red-50 text-red-800 rounded-bl-sm border border-red-300 shadow-lg"
                                    : darkMode
                                        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-bl-sm border border-gray-600"
                                        : "bg-gradient-to-br from-stone-100 to-amber-50 text-stone-800 rounded-bl-sm border border-stone-200"
                                }`}
                        >
                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                                {message.text}
                            </p>

                            {message.type === "crisis" && (
                                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Immediate Support Available
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        <a
                                            href="tel:14416"
                                            className={`${darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow`}
                                        >
                                            📞 Call 14416 Now
                                        </a>
                                        <a
                                            href="https://www.telemanas.mohfw.gov.in/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${darkMode ? 'bg-amber-700 hover:bg-amber-800' : 'bg-amber-600 hover:bg-amber-700'} text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow`}
                                        >
                                            🧑‍⚕️ Tele-MANAS
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 px-1">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-stone-400'}`}>
                                {formatTime(message.timestamp)}
                            </span>
                            {message.mood && (
                                <span className="text-xs">
                                    {moods.find(m => m.value === message.mood)?.emoji}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {message.sender === "user" && (
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${darkMode ? 'bg-gradient-to-br from-amber-700 to-orange-800' : 'bg-gradient-to-br from-amber-600 to-orange-700'
                        } flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0 shadow-md`}>
                        <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
                    </div>
                )}
            </div>
        ));
    }, [messages, darkMode]);

    const getSessionDuration = () => {
        const duration = Math.floor((new Date() - sessionStartTime) / 1000 / 60);
        return duration < 1 ? "Just started" : `${duration} min`;
    };

    return (
        <div className={`min-h-screen ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100'
            } flex items-center justify-center p-3 sm:p-4 md:p-6 transition-colors duration-300`}>
            <div className={`w-full max-w-5xl ${darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-24px)] sm:h-[650px] md:h-[700px]`}>

                {/* HEADER */}
                <div className={`${darkMode
                    ? 'bg-gradient-to-r from-amber-800 via-orange-700 to-amber-700'
                    : 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600'
                    } px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-white shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-md backdrop-blur-sm">
                                <MessageCircle className="w-6 h-6 text-amber-100" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    SAARTHI AI
                                    <Sparkles className="w-5 h-5 text-yellow-300" />
                                </h1>
                                <p className="text-sm text-amber-100">Your safe space to share</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowMoodTracker(!showMoodTracker)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Track your mood"
                            >
                                <TrendingUp className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowResources(!showResources)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Mental health resources"
                            >
                                <BookOpen className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Toggle theme"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Settings"
                            >
                                <Settings className="w-5 h-5" />
                            </button>

                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-amber-100">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Session: {getSessionDuration()}</span>
                        </div>
                        {currentMood && (
                            <div className="flex items-center gap-1">
                                <span>Current mood:</span>
                                <span>{moods.find(m => m.value === currentMood)?.emoji}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOOD TRACKER DROPDOWN */}
                {showMoodTracker && (
                    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-amber-50 border-amber-200'
                        } border-b px-4 sm:px-6 md:px-8 py-4`}>
                        <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-stone-700'}`}>
                            How are you feeling right now?
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {moods.map((mood) => (
                                <button
                                    key={mood.value}
                                    onClick={() => handleMoodSelect(mood)}
                                    className={`p-3 rounded-xl ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-stone-50'
                                        } shadow transition-all transform hover:scale-105 ${currentMood === mood.value ? 'ring-2 ring-amber-500' : ''
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{mood.emoji}</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                                        {mood.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* RESOURCES PANEL */}
                {showResources && (
                    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-stone-200'
                        } border-b px-4 sm:px-6 md:px-8 py-4 max-h-64 overflow-y-auto`}>
                        <div className="flex justify-between items-center mb-3">
                            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-stone-700'}`}>
                                Mental Health Resources
                            </p>
                            <button onClick={() => setShowResources(false)}>
                                <X className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-stone-400'}`} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {mentalHealthResources.map((resource, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-stone-50'
                                        } border ${darkMode ? 'border-gray-500' : 'border-stone-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-2xl">{resource.icon}</span>
                                        <div className="flex-1">
                                            <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-stone-800'
                                                }`}>
                                                {resource.title}
                                            </h3>
                                            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-stone-600'
                                                } mb-2`}>
                                                {resource.description}
                                            </p>
                                            <div className="flex gap-2">
                                                <a
                                                    href={`tel:${resource.phone}`}
                                                    className={`text-xs px-2 py-1 rounded ${darkMode
                                                        ? 'bg-amber-700 hover:bg-amber-800'
                                                        : 'bg-amber-600 hover:bg-amber-700'
                                                        } text-white`}
                                                >
                                                    📞 {resource.phone}
                                                </a>
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-xs px-2 py-1 rounded ${darkMode
                                                        ? 'bg-gray-500 hover:bg-gray-400'
                                                        : 'bg-stone-200 hover:bg-stone-300'
                                                        } ${darkMode ? 'text-gray-100' : 'text-stone-700'}`}
                                                >
                                                    Visit
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SETTINGS PANEL */}
                {showSettings && (
                    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-stone-200'
                        } border-b px-4 sm:px-6 md:px-8 py-4`}>
                        <div className="flex justify-between items-center mb-3">
                            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-stone-700'}`}>
                                Settings
                            </p>
                            <button onClick={() => setShowSettings(false)}>
                                <X className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-stone-400'}`} />
                            </button>
                        </div>
                        <button
                            onClick={handleClearChat}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition
                                ${darkMode
                                    ? 'bg-red-700 hover:bg-red-800 text-white'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                        >
                            🧹 Clear Chat History
                        </button>
                    </div>
                )}

                {/* NAME PROMPT MODAL */}
                {showNamePrompt && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'
                            } rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-amber-800" />
                                </div>
                                <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-stone-800'}`}>
                                    Welcome to SAARTHI AI
                                </h2>
                                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                                    What would you like me to call you? (Optional)
                                </p>
                            </div>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                                placeholder="Your name..."
                                className={`w-full px-4 py-3 border-2 ${darkMode
                                    ? 'border-gray-600 bg-gray-700 text-gray-100'
                                    : 'border-stone-300 bg-stone-50 text-stone-800'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4`}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowNamePrompt(false)}
                                    className={`flex-1 px-4 py-2 rounded-lg ${darkMode
                                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                                        : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                                        }`}
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleNameSubmit}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MESSAGES */}
                <div className={`flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 ${darkMode
                    ? 'bg-gradient-to-b from-gray-800/50 to-gray-900/30'
                    : 'bg-gradient-to-b from-stone-50/50 to-amber-50/30'
                    } custom-scrollbar`}>
                    {memoizedMessages}

                    {(isTyping || aiThinking) && (
                        <div className="flex justify-start mb-6">
                            <div className={`w-8 h-8 rounded-full ${darkMode
                                ? 'bg-gradient-to-br from-amber-600 to-orange-700'
                                : 'bg-gradient-to-br from-amber-200 to-orange-300'
                                } flex items-center justify-center mr-2 shadow-md`}>
                                <Heart className={`w-4 h-4 ${darkMode ? 'text-amber-100' : 'text-amber-800'}`} />
                            </div>
                            <div className={`${darkMode
                                ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
                                : 'bg-gradient-to-br from-stone-100 to-amber-50 border-stone-200'
                                } px-5 py-3.5 rounded-2xl rounded-bl-sm shadow-md border`}>
                                <div className="flex gap-1.5">
                                    <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-stone-400'} rounded-full animate-bounce`} />
                                    <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-stone-400'} rounded-full animate-bounce delay-150`} />
                                    <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-stone-400'} rounded-full animate-bounce delay-300`} />
                                </div>
                                {aiThinking && (
                                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-stone-500'}`}>
                                        Thinking carefully...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT */}
                <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-stone-200 bg-white'
                    } px-4 sm:px-6 md:px-8 py-4`}>
                    <div className="flex items-end gap-3">
                        <textarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={userName ? `Share what's on your mind, ${userName}...` : "Type your message here... Press Enter to send"}
                            rows="1"
                            className={`w-full px-4 py-3 border-2 ${darkMode
                                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                                : 'border-stone-300 bg-stone-50 text-stone-800'
                                } rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-sm max-h-32`}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-2xl hover:from-amber-700 hover:to-orange-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-stone-400'} mt-2 text-center`}>
                        SAARTHI AI provides support, not medical advice. For emergencies, call 14416
                    </p>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${darkMode ? '#374151' : '#fef3e2'};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${darkMode ? '#9ca3af' : '#d4a574'};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${darkMode ? '#6b7280' : '#c49563'};
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .delay-150 {
                    animation-delay: 0.15s;
                }
                .delay-300 {
                    animation-delay: 0.3s;
                }
            `}</style>
        </div>
    );
}


// API key removed for security