import React from "react";
import { X } from "lucide-react";

export default function SettingsPanel({ darkMode, onClose, onClearChat }) {
    return (
        <div
            className={`${
                darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-stone-200"
            } border-b px-4 sm:px-6 md:px-8 py-4`}
        >
            <div className="flex justify-between items-center mb-3">
                <p
                    className={`text-sm font-semibold ${
                        darkMode ? "text-gray-200" : "text-stone-700"
                    }`}
                >
                    Settings
                </p>
                <button onClick={onClose}>
                    <X
                        className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-stone-400"
                        }`}
                    />
                </button>
            </div>
            <button
                onClick={onClearChat}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition
                    ${
                        darkMode
                            ? "bg-red-700 hover:bg-red-800 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
            >
                🧹 Clear Chat History
            </button>
        </div>
    );
}
