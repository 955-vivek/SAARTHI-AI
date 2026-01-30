import React, { useState, useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Header from "./Header";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import MoodTracker from "./MoodTracker";
import ResourcesPanel from "./ResourcesPanel";
import SettingsPanel from "./SettingsPanel";
import NamePromptModal from "./NamePromptModal";
import PanicButton from "./PanicButton";
import { getAIResponse } from "./utils/aiService";

export default function ChatInterface({ onNavigateToUrgent }) {
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
    const [showResources, setShowResources] = useState(false);
    const [currentMood, setCurrentMood] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [conversationContext, setConversationContext] = useState([]);
    const [sessionStartTime] = useState(new Date());
    const [aiThinking, setAiThinking] = useState(false);
    const [userName, setUserName] = useState("");
    const [showNamePrompt, setShowNamePrompt] = useState(true);


    const detectCrisisLanguage = (text) => {
        if (!text) return false;

        const crisisKeywords = [
            "suicide",
            "kill myself",
            "end my life",
            "i want to die",
            "i don't want to live",
            "self harm",
            "cut myself",
            "hurt myself",
            "overdose",
            "jump off",
            "hang myself",
            "no reason to live",
            "life is pointless",
            "better off dead"
        ];  

        const normalizedText = text.toLowerCase();

        return crisisKeywords.some((keyword) =>
            normalizedText.includes(keyword)
        );
    };


    const handleSendMessage = async () => {
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
        setConversationContext((prev) => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        const aiResponse = await getAIResponse(
            inputText,
            currentMood,
            conversationContext,
            userName,
            setAiThinking
        );

        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: "bot",
                timestamp: new Date(),
                type: isCrisis ? "crisis" : "normal",
            };

            setMessages((prev) => [...prev, botMessage]);
            setConversationContext((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 300);
    };

    const handleMoodSelect = (mood) => {
        setCurrentMood(mood.value);
        setShowMoodTracker(false);

        const moodMessage = {
            id: Date.now(),
            text: `Mood updated: ${mood.label} ${mood.emoji}`,
            sender: "system",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, moodMessage]);
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
            setMessages((prev) => [...prev, welcomeMessage]);
        }
    };

    const handleClearChat = () => {
        const confirmClear = window.confirm(
            "Are you sure you want to clear this chat session?"
        );
        if (!confirmClear) return;

        setMessages([
            {
                id: Date.now(),
                text: `Chat cleared. I'm here again whenever you want to talk${userName ? `, ${userName}` : ""
                    }. 💛`,
                sender: "bot",
                timestamp: new Date(),
                mood: null,
            },
        ]);

        setConversationContext([]);
        setCurrentMood(null);
        setShowSettings(false);
    };

    const getSessionDuration = () => {
        const duration = Math.floor((new Date() - sessionStartTime) / 1000 / 60);
        return duration < 1 ? "Just started" : `${duration} min`;
    };

    return (
        <div
            className={`min-h-screen ${darkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                : "bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100"
                } flex items-center justify-center p-3 sm:p-4 md:p-6 transition-colors duration-300`}
        >
            <div
                className={`w-full max-w-5xl ${darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-24px)] sm:h-[650px] md:h-[700px]`}
            >
                <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    showMoodTracker={showMoodTracker}
                    setShowMoodTracker={setShowMoodTracker}
                    showResources={showResources}
                    setShowResources={setShowResources}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    currentMood={currentMood}
                    getSessionDuration={getSessionDuration}
                />

                {showMoodTracker && (
                    <MoodTracker
                        darkMode={darkMode}
                        currentMood={currentMood}
                        onMoodSelect={handleMoodSelect}
                    />
                )}

                {showResources && (
                    <ResourcesPanel
                        darkMode={darkMode}
                        onClose={() => setShowResources(false)}
                    />
                )}

                {showSettings && (
                    <SettingsPanel
                        darkMode={darkMode}
                        onClose={() => setShowSettings(false)}
                        onClearChat={handleClearChat}
                    />
                )}

                {showNamePrompt && (
                    <NamePromptModal
                        darkMode={darkMode}
                        userName={userName}
                        setUserName={setUserName}
                        onSubmit={handleNameSubmit}
                        onSkip={() => setShowNamePrompt(false)}
                    />
                )}

                <MessageList
                    messages={messages}
                    darkMode={darkMode}
                    isTyping={isTyping}
                    aiThinking={aiThinking}
                />

                <InputArea
                    darkMode={darkMode}
                    inputText={inputText}
                    setInputText={setInputText}
                    onSendMessage={handleSendMessage}
                    userName={userName}
                />
            </div>

            <PanicButton onNavigateToUrgent={onNavigateToUrgent} />
        </div>
    );
}
