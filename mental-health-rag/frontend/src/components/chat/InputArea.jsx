import React, { useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";

export default function InputArea({
    darkMode,
    inputText,
    setInputText,
    onSendMessage,
    userName,
}) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    }, [inputText]);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
            }
        },
        [onSendMessage]
    );

    return (
        <div
            className={`border-t ${
                darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-stone-200 bg-white"
            } px-4 sm:px-6 md:px-8 py-4`}
        >
            <div className="flex items-end gap-3">
                <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                        userName
                            ? `Share what's on your mind, ${userName}...`
                            : "Type your message here... Press Enter to send"
                    }
                    rows="1"
                    className={`w-full px-4 py-3 border-2 ${
                        darkMode
                            ? "border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400"
                            : "border-stone-300 bg-stone-50 text-stone-800"
                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-sm max-h-32`}
                />
                <button
                    onClick={onSendMessage}
                    disabled={!inputText.trim()}
                    className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-2xl hover:from-amber-700 hover:to-orange-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <p
                className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-stone-400"
                } mt-2 text-center`}
            >
                SAARTHI AI provides support, not medical advice. For emergencies, call
                14416
            </p>
        </div>
    );
}
