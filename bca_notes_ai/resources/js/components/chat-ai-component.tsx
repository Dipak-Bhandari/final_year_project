import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatAI() {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { role: "user", text: input }]);
        setLoading(true);
        try {
            const res = await axios.post("/chat", { question: input });
            setMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "ai", text: "Oops, something went wrong." }]);
        } finally {
            setInput("");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-1 dark:border-gray-700"></div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800 ">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[80%] px-3 py-2 rounded-lg ${msg.role === "user"
                            ? "ml-auto bg-blue-100 text-blue-900"
                            : "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="text-gray-500 dark:text-gray-400">AI is typing...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask a question..."
                    disabled={loading}
                />
                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    onClick={sendMessage}
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
