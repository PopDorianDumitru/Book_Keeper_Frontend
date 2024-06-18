import { Key } from "react";
import "../css/UsersChat.css"
const ChatMessage = ({username, message, userMessage, key}: {username: String | undefined, message: String, userMessage: boolean, key: Key}) => {
    return (
        <div key={key} className={"chat-message " + ( userMessage ? "user-message" : "" )}>
            <div className="chat-message-user">
                <p>{username}</p>
            </div>
            <div className="chat-message-content">
                <p>{message}</p>
            </div>
        </div>
    )
}

export default ChatMessage;