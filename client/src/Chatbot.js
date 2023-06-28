import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

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
                setChat((prev) => [...prev, { text: JSON.stringify(response.data.data), user: "Chatbot" }]);
                setChat((prev) => [...prev, { text: response.data.message, user: "Chatbot" }]);
                startChat();
            }, 500); // Delay of 0.5 seconds
        }
    };

    return (
        <section style={{ backgroundColor: "#eee" }}>
            <div className="container py-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-28 col-lg-28 col-xl-28">
                        <div className="card" id="chat2">
                            <div className="card-header d-flex justify-content-between align-items-center p-3">
                                <h5 className="mb-0">Chat</h5>
                                <button type="button" className="btn btn-primary btn-sm" onClick={startChat}>Let's Chat</button>
                            </div>
                            <div className="card-body" style={{ position: "relative", height: "400px", overflowY: "auto" }}>
                                {chat.map((msg, idx) => (
                                    <div className={`d-flex flex-row justify-content-${msg.user === 'You' ? 'end' : 'start'} mb-4`} key={idx}>
                                        <img src={`https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava${msg.user === 'You' ? '4' : '3'}-bg.webp`} alt="avatar" style={{ width: "45px" }} />
                                        <div>
                                            <p className={`small p-2 ${msg.user === 'You' ? 'me' : 'ms'}-3 mb-1 text-${msg.user === 'You' ? 'white' : 'dark'} rounded-3`} style={{ backgroundColor: msg.user === 'You' ? '#0d6efd' : '#f5f6f7' }}>{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp" alt="avatar 3" style={{ width: "40px" }} />
                                <form onSubmit={handleSend} className="d-flex align-items-center w-100">
                                    <input type="text" className="form-control form-control-lg" placeholder="Type message" value={input} onChange={(e) => setInput(e.target.value)} />
                                    <button type="submit" className="btn btn-primary ms-1"><FontAwesomeIcon icon={faPaperPlane} /></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Chatbot;
