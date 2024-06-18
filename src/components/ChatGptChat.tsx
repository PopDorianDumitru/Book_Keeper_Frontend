import { useState } from "react"
import "../css/ChatGptChat.css"
import useAxiosStore from "../store/axiosStore";
const ChatGptChat = ({bookTitle}: {bookTitle: string}) => {
    const [message, setMessage] = useState("");
    const {getAxiosInstance} = useAxiosStore(state=>state);
    const addUserMessage = () => {
        if(message === "")
            return;
        const chatContainer = document.getElementsByClassName("chat-container")[0];
        const newMessageDiv = document.createElement("div");
        newMessageDiv.className="user-message"
        const newMessage = document.createElement("p");
        newMessage.innerText = message;
        newMessageDiv.appendChild(newMessage);
        chatContainer.appendChild(newMessageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        setMessage("");
        getAxiosInstance().post(`${process.env.REACT_APP_BASIC_URL}/question`, {message: message, title: bookTitle})
        .then((response)=>{
            const newMessageDiv = document.createElement("div");
            newMessageDiv.className="bot-message"
            const newMessage = document.createElement("p");
            newMessage.innerText = response.data.answer;
            newMessageDiv.appendChild(newMessage);
            chatContainer.appendChild(newMessageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch((error)=>{
            const newMessageDiv = document.createElement("div");
            newMessageDiv.className="bot-message"
            const newMessage = document.createElement("p");
            newMessage.innerText = "I'm sorry. Something went wrong. Please try again later.";
            newMessageDiv.appendChild(newMessage);
            chatContainer.appendChild(newMessageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;

        })
    }
    return (
        <div>
            <div className="chat-container">
                <div className="bot-message">
                    <p>Ask me anything about the book!</p>
                </div>
            </div>
            <div className="user-input">
                <input type="text" value={message} onChange={(v) => setMessage(v.target.value)}  id="user-message"></input>
                <button onClick={() => addUserMessage()}>Send</button>
            </div>
        </div>
    )
}

export default ChatGptChat;