import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm HelloFlint, the Bright Loop Media AI assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Create chat completion payload
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later or visit our contact page." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                id="chat-widget-trigger"
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-void border border-white/20 text-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
                    }`}
            >
                <MessageCircle size={24} />
            </button>

            {/* Glassmorphism Panel */}
            <div
                className={`fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl glass-panel origin-bottom-right transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-void">HF</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">HelloFlint</h3>
                            <p className="text-xs text-white/50 text-left">AI Assistant</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" data-lenis-prevent="true">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === "user"
                                    ? "bg-white text-black rounded-tr-sm"
                                    : "bg-white/10 text-white rounded-tl-sm border border-white/5"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 text-white/50 rounded-2xl rounded-tl-sm px-4 py-2 border border-white/5 flex gap-1 items-center h-9">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500/50 text-white placeholder:text-white/30"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:hover:text-cyan-400 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div >
        </>
    );
}
