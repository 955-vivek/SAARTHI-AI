import { MessageCircle, Heart, Shield, Clock, Sparkles, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 px-12 py-12 text-white">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-12 h-12 text-amber-100" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold">SAARTHI AI</h1>
                            <p className="text-xl text-amber-100">
                                Your compassionate companion for mental wellness
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="px-12 py-12">

                    <h2 className="text-3xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                        <Sparkles className="w-7 h-7 text-amber-600" />
                        What is SAARTHI AI?
                    </h2>

                    <p className="text-lg text-stone-600 mb-10">
                        Mental health matters, and sometimes we all need someone to talk to.
                        SAARTHI AI provides a supportive environment where you can express your thoughts and feelings freely.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-12">
                        <Feature icon={<Shield />} title="Safe & Confidential" />
                        <Feature icon={<Clock />} title="24/7 Availability" />
                        <Feature icon={<Heart />} title="Compassionate Support" />
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-600 rounded-lg p-5 mb-10">
                        <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-amber-600" />
                            Important Notice
                        </h3>
                        <p className="text-stone-700">
                            SAARTHI AI is not a substitute for professional mental health care.
                        </p>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate("/chat")}
                            className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-12 py-5 rounded-2xl hover:from-amber-700 hover:to-orange-800 transition-all font-semibold shadow-xl flex items-center gap-3"
                        >
                            Start Chatting
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title }) {
    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-md border border-amber-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center mb-4 shadow-md">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-stone-800">{title}</h3>
        </div>
    );
}
