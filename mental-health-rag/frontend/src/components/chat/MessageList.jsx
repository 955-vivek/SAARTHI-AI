import React, { useRef, useEffect, useMemo } from "react";
import { Heart, Smile, CheckCircle, AlertCircle } from "lucide-react";
import { moods } from "./utils/constants";

export default function MessageList({ messages, darkMode, isTyping, aiThinking }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const memoizedMessages = useMemo(() => {
        return messages.map((message) => (
            <div
                key={message.id}
                className={`flex ${
                    message.sender === "user"
                        ? "justify-end"
                        : message.sender === "system"
                        ? "justify-center"
                        : "justify-start"
                } mb-6 animate-fade-in`}
            >
                {message.sender === "bot" && (
                    <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                            darkMode
                                ? "bg-gradient-to-br from-amber-600 to-orange-700"
                                : "bg-gradient-to-br from-amber-200 to-orange-300"
                        } flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 shadow-md`}
                    >
                        <Heart
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                darkMode ? "text-amber-100" : "text-amber-800"
                            }`}
                        />
                    </div>
                )}

                {message.sender === "system" && (
                    <div
                        className={`px-4 py-2 rounded-full text-xs ${
                            darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-stone-200 text-stone-600"
                        } flex items-center gap-2`}
                    >
                        <CheckCircle className="w-3 h-3" />
                        {message.text}
                    </div>
                )}

                {message.sender !== "system" && (
                    <div
                        className={`flex flex-col ${
                            message.sender === "user" ? "items-end" : "items-start"
                        } max-w-[75%] sm:max-w-[65%]`}
                    >
                        <div
                            className={`px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-md ${
                                message.sender === "user"
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
                                            className={`${
                                                darkMode
                                                    ? "bg-red-700 hover:bg-red-800"
                                                    : "bg-red-600 hover:bg-red-700"
                                            } text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow`}
                                        >
                                            📞 Call 14416 Now
                                        </a>
                                        <a
                                            href="https://www.telemanas.mohfw.gov.in/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${
                                                darkMode
                                                    ? "bg-amber-700 hover:bg-amber-800"
                                                    : "bg-amber-600 hover:bg-amber-700"
                                            } text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow`}
                                        >
                                            🧑‍⚕️ Tele-MANAS
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 px-1">
                            <span
                                className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-stone-400"
                                }`}
                            >
                                {formatTime(message.timestamp)}
                            </span>
                            {message.mood && (
                                <span className="text-xs">
                                    {moods.find((m) => m.value === message.mood)?.emoji}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {message.sender === "user" && (
                    <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                            darkMode
                                ? "bg-gradient-to-br from-amber-700 to-orange-800"
                                : "bg-gradient-to-br from-amber-600 to-orange-700"
                        } flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0 shadow-md`}
                    >
                        <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
                    </div>
                )}
            </div>
        ));
    }, [messages, darkMode]);

    return (
        <div
            className={`flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 ${
                darkMode
                    ? "bg-gradient-to-b from-gray-800/50 to-gray-900/30"
                    : "bg-gradient-to-b from-stone-50/50 to-amber-50/30"
            } custom-scrollbar`}
        >
            {memoizedMessages}

            {(isTyping || aiThinking) && (
                <div className="flex justify-start mb-6">
                    <div
                        className={`w-8 h-8 rounded-full ${
                            darkMode
                                ? "bg-gradient-to-br from-amber-600 to-orange-700"
                                : "bg-gradient-to-br from-amber-200 to-orange-300"
                        } flex items-center justify-center mr-2 shadow-md`}
                    >
                        <Heart
                            className={`w-4 h-4 ${
                                darkMode ? "text-amber-100" : "text-amber-800"
                            }`}
                        />
                    </div>
                    <div
                        className={`${
                            darkMode
                                ? "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600"
                                : "bg-gradient-to-br from-stone-100 to-amber-50 border-stone-200"
                        } px-5 py-3.5 rounded-2xl rounded-bl-sm shadow-md border`}
                    >
                        <div className="flex gap-1.5">
                            <div
                                className={`w-2 h-2 ${
                                    darkMode ? "bg-gray-400" : "bg-stone-400"
                                } rounded-full animate-bounce`}
                            />
                            <div
                                className={`w-2 h-2 ${
                                    darkMode ? "bg-gray-400" : "bg-stone-400"
                                } rounded-full animate-bounce delay-150`}
                            />
                            <div
                                className={`w-2 h-2 ${
                                    darkMode ? "bg-gray-400" : "bg-stone-400"
                                } rounded-full animate-bounce delay-300`}
                            />
                        </div>
                        {aiThinking && (
                            <p
                                className={`text-xs mt-2 ${
                                    darkMode ? "text-gray-400" : "text-stone-500"
                                }`}
                            >
                                Thinking carefully...
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${darkMode ? "#374151" : "#fef3e2"};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${darkMode ? "#9ca3af" : "#d4a574"};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${darkMode ? "#6b7280" : "#c49563"};
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
