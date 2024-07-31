import React, {useState, useRef, useEffect} from "react";
import {API_URL} from "../constants";

interface Message {
    user: boolean;
    text: string;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(()=>{
        const storedMessages = localStorage.getItem('messages');
        return storedMessages ? JSON.parse(storedMessages) : []
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMessages = [...messages, {user: true, text: input}];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const toneOfVoiceRes = await fetch(`${API_URL}/tov`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: input}),
            });
            const toneOfVoiceData = await toneOfVoiceRes.json();

            const emailRes = await fetch(`${API_URL}/email?characteristic=bk:${toneOfVoiceData.response}`);
            const emailData = await emailRes.json();

            setMessages([...newMessages, {user: false, text: emailData.response}]);
        } catch (error) {
            console.error(error);
            setMessages([...newMessages, {user: false, text: "Sorry, I am not able to respond right now."}]);
        }

        setLoading(false);
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    return (
        <div className="flex flex-col h-screen w-1/2 bg-gray-100">
            <div className="flex-1 overflow-y-scroll p-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.user ? "text-right" : "text-left"}`}>
                        <span
                            className={`inline-block p-2 rounded ${msg.user ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                          {msg.text}
                        </span>
                    </div>
                ))}
                {loading && (
                    <div className="bg-gray-200 text-left p-2 flex w-fit rounded">
                        <span className="loading loading-dots loading-md bg-primary-content"></span>
                    </div>
                )}
                <div ref={messagesEndRef}/>
            </div>
            <div className="p-4 bg-white flex gap-4">
                <input
                    className="input w-full rounded-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleEnter}
                    placeholder="Type your message..."
                />
                <button
                    className="btn"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
