import React from "react";
import { X } from "lucide-react";
import { mentalHealthResources } from "./utils/constants";

export default function ResourcesPanel({ darkMode, onClose }) {
    return (
        <div
            className={`${
                darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-stone-200"
            } border-b px-4 sm:px-6 md:px-8 py-4 max-h-64 overflow-y-auto`}
        >
            <div className="flex justify-between items-center mb-3">
                <p
                    className={`text-sm font-semibold ${
                        darkMode ? "text-gray-200" : "text-stone-700"
                    }`}
                >
                    Mental Health Resources
                </p>
                <button onClick={onClose}>
                    <X
                        className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-stone-400"
                        }`}
                    />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mentalHealthResources.map((resource, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                            darkMode ? "bg-gray-600" : "bg-stone-50"
                        } border ${
                            darkMode ? "border-gray-500" : "border-stone-200"
                        }`}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">{resource.icon}</span>
                            <div className="flex-1">
                                <h3
                                    className={`font-semibold text-sm ${
                                        darkMode ? "text-gray-100" : "text-stone-800"
                                    }`}
                                >
                                    {resource.title}
                                </h3>
                                <p
                                    className={`text-xs ${
                                        darkMode ? "text-gray-300" : "text-stone-600"
                                    } mb-2`}
                                >
                                    {resource.description}
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href={`tel:${resource.phone}`}
                                        className={`text-xs px-2 py-1 rounded ${
                                            darkMode
                                                ? "bg-amber-700 hover:bg-amber-800"
                                                : "bg-amber-600 hover:bg-amber-700"
                                        } text-white`}
                                    >
                                        📞 {resource.phone}
                                    </a>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-xs px-2 py-1 rounded ${
                                            darkMode
                                                ? "bg-gray-500 hover:bg-gray-400"
                                                : "bg-stone-200 hover:bg-stone-300"
                                        } ${
                                            darkMode
                                                ? "text-gray-100"
                                                : "text-stone-700"
                                        }`}
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
    );
}
