// src/Chatbot.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [chat, setChat] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        startChat();
        // eslint-disable-next-line
    }, []);

    useEffect(scrollToBottom, [chat]);

    const startChat = async () => {
        const response = await axios.get("http://localhost:8080/start");
        setTimeout(() => {
            setChat((prev) => [...prev, { text: response.data.question, user: "Chatbot" }]);
        }, 500); // Delay of 0.5 seconds
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setChat((prev) => [...prev, { text: input, user: "You" }]);
        const response = await axios.post("http://localhost:8080/chat", {
            answer: input,
        });
        setInput("");
        if (response.data.question) {
            setTimeout(() => {
                setChat((prev) => [...prev, { text: response.data.question, user: "Chatbot" }]);
            }, 500); // Delay of 0.5 seconds
        } else {
            setTimeout(() => {
                setChat((prev) => [...prev, { text: response.data.data, user: "Chatbot" }]);
                startChat();
            }, 500); // Delay of 0.5 seconds
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {chat.map((message, index) => (
                    <div key={index} className={message.user}>
                        {message.user}: {message.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
