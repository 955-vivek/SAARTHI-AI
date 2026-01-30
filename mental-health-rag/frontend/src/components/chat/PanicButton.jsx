import React, { useState } from "react";
import { PhoneForwarded  } from "lucide-react";

export default function PanicButton({ onNavigateToUrgent }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onNavigateToUrgent}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-8 right-8 z-50 group"
            aria-label="Get urgent help"
        >
            <div
                className={`relative flex items-center justify-center transition-all duration-300 ${
                    isHovered ? "scale-110" : "scale-100"
                }`}
            >
                {/* Pulsing rings */}
                <div className="absolute inset-0 animate-ping-slow">
                    <div className="w-16 h-16 rounded-full bg-red-500/30"></div>
                </div>
                <div className="absolute inset-0 animate-ping-slower">
                    <div className="w-16 h-16 rounded-full bg-red-500/20"></div>
                </div>

                {/* Main button */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl flex items-center justify-center transform transition-transform hover:rotate-12">
                    <PhoneForwarded  className="w-8 h-8 text-white animate-pulse" />
                </div>
            </div>

            {/* Tooltip */}
            {isHovered && (
                <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg shadow-xl whitespace-nowrap animate-fade-in">
                    Need Urgent Help?
                    <div className="absolute top-full right-6 -mt-1">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}

            <style >{`
                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                }
                @keyframes ping-slower {
                    0% {
                        transform: scale(1);
                        opacity: 0.4;
                    }
                    50% {
                        transform: scale(1.3);
                        opacity: 0.2;
                    }
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animate-ping-slower {
                    animation: ping-slower 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </button>
    );
}
