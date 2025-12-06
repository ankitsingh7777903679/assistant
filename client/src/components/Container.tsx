import { useState } from "react";
import MessageRow from "./MessageRow";

function Container() {

    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const BASE_URL = 'http://localhost:4000';

    const callAPI = async (updatedMessages: { role: string; content: string }[]) => {
        try {
            const response = await fetch(BASE_URL + '/chat', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
            })
            if(response.ok){
                const data = await response.json();
                // Add the AI response to messages
                setMessages((prev) => [...prev, data.message]);
            } else {
                alert('Failed to get response from server');
            }
        } catch (error) {
            alert(error)
        }finally{
            setIsDisabled(false);
        }
    }



    const handelSendBtn = async() => {
        if (!inputValue) {
            return;
        }
        setIsDisabled(true);

        const userMsg = { role: "user", content: inputValue };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);

        setInputValue('');
        await callAPI(updatedMessages);
    }

    const renderMessages = () => {
        return messages.map((msgObj, index) => {
            return <MessageRow {...msgObj} index={index} key={index} />
        })
    }

    return (
        <div className="center-wrap">
            <div className="chat-panel" role="application" aria-label="chatbot">
                <div className="chat-header">
                    <div className="avatar">AI</div>
                    <div className="header-title">
                        <div className="title">AI Assistant</div>
                    </div>
                </div>

                <div id="chatBody" className="chat-body" aria-live="polite">
                    
                    {renderMessages()}
                </div>

                <div className="chat-input">
                    <div className="input-box" role="search">
                        <input
                            id="chatInput"
                            type="text"
                            placeholder="Message Claude..."
                            aria-label="Type your message"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handelSendBtn();
                                }
                            }}
                        />
                    </div>
                    <button id="sendBtn" className="btn-send" aria-label="Send message" onClick={() => handelSendBtn()} disabled={!inputValue || isDisabled} >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Container