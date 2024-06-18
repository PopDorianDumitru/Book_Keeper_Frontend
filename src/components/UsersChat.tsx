import { ReactElement, useEffect, useRef, useState } from "react";
import "../css/UsersChat.css"
import ChatMessage from "./ChatMessage";
import useUserStore from "../store/userStore";
import useNotificationStore from "../store/notificationStore";
const UsersChat = () => {
    const ws = useRef<null | WebSocket>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {setWarning, removeWarning} = useNotificationStore(state=>state);
    useEffect(()=>{
        if(ws.current == null)
            ws.current = new WebSocket(`${process.env.REACT_APP_CHAT_SOCKET_URL}`);
        ws.current.onmessage = (ev)=>{
            const data = JSON.parse(ev.data);
            const newMessage = ChatMessage({username: data.username, message: data.message, userMessage: false, key: Math.random().toString(20)});
            setMessages((prevMessages) => [...prevMessages, newMessage]);

        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ReactElement[]>([]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

    const {getUser} = useUserStore(state=>state);
    const sendMessage = () => {
        if(message === "")
            return;
        try{
            ws.current?.send((JSON.stringify({username: getUser()?.username, message: message})));
            const newMessage = ChatMessage({username: getUser()?.username, message: message, userMessage: true, key: Math.random().toString(20)});
            setMessages([...messages, newMessage]);
        }
        catch(e){
            setWarning({message: "Could not send message. Please try again later."});
            setTimeout(()=>{
                removeWarning();
            }, 4000);
        }
        
        setMessage("");
        return;
    }

    return (
        <div className="user-chat-container">
            <div className="user-messages-container">
                {messages.map((message, index) => {
                    return message;
                })}
                <div ref={messagesEndRef} />

            </div>
            <div className="input-message">
                <input value={message} onChange={(e) => setMessage(e.currentTarget.value)} type="text" id="user-message"></input>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
export default UsersChat;

