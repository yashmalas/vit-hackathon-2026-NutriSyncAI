"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
        { role: "assistant", content: "Hello! I'm **Sync**, your AI health assistant. How can I help you optimize your nutrition today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [chatHistory, isOpen]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMsg = message.trim();
        setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
        setMessage("");
        setIsLoading(true);

        try {
            const res = await api.post("/chat/chat", {
                message: userMsg,
                history: chatHistory.map(m => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: m.content }]
                }))
            });

            setChatHistory(prev => [...prev, { role: "assistant", content: res.data.response }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, my neural links are a bit fuzzy. Can you try again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors",
                    isOpen ? "bg-accent-danger text-white" : "bg-accent-primary text-base"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-secondary rounded-full border-2 border-base animate-pulse" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-40 right-6 sm:bottom-24 sm:right-8 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] glass-panel rounded-2xl shadow-2xl border border-border-glow overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border-glow/30 bg-accent-primary/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent-primary/10 rounded-lg">
                                    <Bot className="w-5 h-5 text-accent-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-display font-bold text-primary">Sync AI</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                                        <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Always Online</span>
                                    </div>
                                </div>
                            </div>
                            <Sparkles className="w-4 h-4 text-accent-primary/50" />
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {chatHistory.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                                            msg.role === "user"
                                                ? "bg-accent-primary text-base rounded-tr-none"
                                                : "bg-surface border border-border-glow/30 text-primary/90 rounded-tl-none prose prose-invert prose-sm"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-surface border border-border-glow/30 p-3 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border-glow/30 bg-surface/30">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask Sync anything..."
                                    className="w-full bg-base/50 border border-border-glow/50 rounded-xl pl-4 pr-12 py-3 text-sm text-primary placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim() || isLoading}
                                    className="absolute right-2 top-2 p-2 text-accent-primary hover:text-accent-secondary disabled:text-muted transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
