import React from "react";
import { Phone, ArrowLeft, Heart, Clock, MessageCircle } from "lucide-react";
import { mentalHealthResources } from "./utils/constants";

export default function UrgentHelp({ onNavigateBack }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 px-6 md:px-8 py-6 text-white">
                    <button
                        onClick={onNavigateBack}
                        className="flex items-center gap-2 mb-4 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">Back to Chat</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Heart className="w-8 h-8 text-red-100" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Urgent Help</h1>
                            <p className="text-red-100 mt-1">
                                You're not alone. Help is available right now.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Immediate Action Section */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                        <h2 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                            <Phone className="w-6 h-6" />
                            If you're in immediate danger
                        </h2>
                        <p className="text-red-800 mb-4">
                            Please call emergency services or reach out to these crisis
                            helplines immediately:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="tel:112"
                                className="flex-1 min-w-[200px] bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 text-center"
                            >
                                📞 Emergency: 112
                            </a>
                            <a
                                href="tel:14416"
                                className="flex-1 min-w-[200px] bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 text-center"
                            >
                                🧑‍⚕️ Tele-MANAS: 14416
                            </a>
                        </div>
                    </div>

                    {/* Mental Health Resources */}
                    <h2 className="text-2xl font-bold text-stone-800 mb-4">
                        24/7 Mental Health Support
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {mentalHealthResources.map((resource, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{resource.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-stone-800 mb-1">
                                            {resource.title}
                                        </h3>
                                        <p className="text-sm text-stone-600 mb-3">
                                            {resource.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <a
                                                href={`tel:${resource.phone}`}
                                                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors"
                                            >
                                                📞 {resource.phone}
                                            </a>
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Coping Strategies */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6" />
                            While you wait or if you need immediate coping strategies
                        </h2>
                        <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4">
                                <h3 className="font-semibold text-stone-800 mb-2">
                                    🧘 Grounding Technique (5-4-3-2-1)
                                </h3>
                                <p className="text-sm text-stone-600">
                                    Name 5 things you see, 4 things you can touch, 3 things
                                    you hear, 2 things you smell, and 1 thing you taste.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <h3 className="font-semibold text-stone-800 mb-2">
                                    🫁 Box Breathing
                                </h3>
                                <p className="text-sm text-stone-600">
                                    Breathe in for 4 counts, hold for 4, exhale for 4, hold
                                    for 4. Repeat 4 times.
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <h3 className="font-semibold text-stone-800 mb-2">
                                    💭 Reach Out
                                </h3>
                                <p className="text-sm text-stone-600">
                                    Text or call a trusted friend or family member. You don't
                                    have to face this alone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Return to Chat */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={onNavigateBack}
                            className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Return to SAARTHI AI Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
