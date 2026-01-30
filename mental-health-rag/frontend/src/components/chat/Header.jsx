import React from "react";
import {
    MessageCircle,
    Settings,
    Clock,
    TrendingUp,
    Moon,
    Sun,
    BookOpen,
    Sparkles,
} from "lucide-react";
import { moods } from "./utils/constants";

export default function Header({
    darkMode,
    setDarkMode,
    showMoodTracker,
    setShowMoodTracker,
    showResources,
    setShowResources,
    showSettings,
    setShowSettings,
    currentMood,
    getSessionDuration,
}) {
    return (
        <div
            className={`${
                darkMode
                    ? "bg-gradient-to-r from-amber-800 via-orange-700 to-amber-700"
                    : "bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600"
            } px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-white shadow-lg`}
        >
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
                        {darkMode ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
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

            <div className="mt-3 flex items-center gap-4 text-xs text-amber-100">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Session: {getSessionDuration()}</span>
                </div>
                {currentMood && (
                    <div className="flex items-center gap-1">
                        <span>Current mood:</span>
                        <span>{moods.find((m) => m.value === currentMood)?.emoji}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
