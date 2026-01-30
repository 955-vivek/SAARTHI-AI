import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
// import ChatInterface from "./components/ChatInterface";
import ChatInterface from "../components/chat/ChatInterface";
import UrgentHelp from "../components/chat/UrgentHelp";

export default function Chat() {
    const [currentRoute, setCurrentRoute] = useState("/");

    const navigateToUrgent = () => {
        setCurrentRoute("/urgent");
    };

    const navigateToHome = () => {
        setCurrentRoute("/");
    };

    return (
        <div className="min-h-screen">
            {currentRoute === "/" && (
                <ChatInterface onNavigateToUrgent={navigateToUrgent} />
            )}
            {currentRoute === "/urgent" && (
                <UrgentHelp onNavigateBack={navigateToHome} />
            )}
        </div>
    );
}
