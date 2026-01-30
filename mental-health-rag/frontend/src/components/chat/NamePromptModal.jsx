import React from "react";
import { User } from "lucide-react";

export default function NamePromptModal({
    darkMode,
    userName,
    setUserName,
    onSubmit,
    onSkip,
}) {
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSubmit();
        }
    };

    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                } rounded-2xl p-6 max-w-md w-full shadow-2xl`}
            >
                <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-8 h-8 text-amber-800" />
                    </div>
                    <h2
                        className={`text-xl font-bold ${
                            darkMode ? "text-gray-100" : "text-stone-800"
                        }`}
                    >
                        Welcome to SAARTHI AI
                    </h2>
                    <p
                        className={`text-sm mt-2 ${
                            darkMode ? "text-gray-300" : "text-stone-600"
                        }`}
                    >
                        What would you like me to call you? (Optional)
                    </p>
                </div>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your name..."
                    className={`w-full px-4 py-3 border-2 ${
                        darkMode
                            ? "border-gray-600 bg-gray-700 text-gray-100"
                            : "border-stone-300 bg-stone-50 text-stone-800"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4`}
                />
                <div className="flex gap-2">
                    <button
                        onClick={onSkip}
                        className={`flex-1 px-4 py-2 rounded-lg ${
                            darkMode
                                ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                                : "bg-stone-200 hover:bg-stone-300 text-stone-700"
                        }`}
                    >
                        Skip
                    </button>
                    <button
                        onClick={onSubmit}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg hover:from-amber-700 hover:to-orange-800"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
