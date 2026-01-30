import React from "react";
import { moods } from "./utils/constants";

export default function MoodTracker({ darkMode, currentMood, onMoodSelect }) {
    return (
        <div
            className={`${
                darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-amber-50 border-amber-200"
            } border-b px-4 sm:px-6 md:px-8 py-4`}
        >
            <p
                className={`text-sm font-semibold mb-3 ${
                    darkMode ? "text-gray-200" : "text-stone-700"
                }`}
            >
                How are you feeling right now?
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        onClick={() => onMoodSelect(mood)}
                        className={`p-3 rounded-xl ${
                            darkMode
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-white hover:bg-stone-50"
                        } shadow transition-all transform hover:scale-105 ${
                            currentMood === mood.value
                                ? "ring-2 ring-amber-500"
                                : ""
                        }`}
                    >
                        <div className="text-2xl mb-1">{mood.emoji}</div>
                        <div
                            className={`text-xs ${
                                darkMode ? "text-gray-300" : "text-stone-600"
                            }`}
                        >
                            {mood.label}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
