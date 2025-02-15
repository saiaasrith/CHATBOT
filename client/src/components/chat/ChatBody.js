import {useContext, useState, useEffect} from 'react';
import {SocketContext} from "../../config/context.js";
import styles from "../../styles/chat.module.css";
import {Link} from "react-router-dom";
import ChatMsg from "./ChatMsg";
// import ChatMetaMsg from "./ChatMetaMsg";
import ChatTypingIndicator from "./ChatTypingIndicator";
import {Rings} from "react-loader-spinner";

function ChatBody() {

  const chatSocket = useContext(SocketContext);
  const [chatStatus, setChatStatus] = useState(chatSocket.chatStatus);

  const onChatStatusChange = () => {
    setChatStatus(chatSocket.chatStatus);
  }

  useEffect(() => {
    chatSocket.attach(onChatStatusChange);

    // Detach observer when component unmounted
    return() => chatSocket.detach(onChatStatusChange);
  })

  if (chatStatus === "Connected") {
    return <ChatBodyConnected/>;
  } else if (chatStatus === "Searching") {
    return <ChatBodySearching/>;
  } else if (chatStatus === "Unavailable") {
    return <ChatBodyUnavailable/>;
  } else { // chatStatus === "Disconnected"
    return <ChatBodyConnected/>; // to persist the previous chat messages
  }

}

function ChatBodyConnected() {
  const chatSocket = useContext(SocketContext);
  const [chatMessages, setChatMessages] = useState([]);

  const onChatMessagesChange = () => {
    let messages = chatSocket.messagesList.map((chatMessage, index) => {
      return (<ChatMsg key={index} message={chatMessage.message} msgType={chatMessage.party}/>);
    });

    // Add ChatTypingIndicator is stranger is typing to the chatMessages
    if (chatSocket.isStrangerTyping) {
      messages.push(<ChatTypingIndicator key={messages.length}/>);
    } else {
      if (messages.length > 0 && messages[messages.length - 1].type === <ChatTypingIndicator/>.type) {
        messages.pop(ChatTypingIndicator);
      }
    }
    setChatMessages(messages);
  }

  useEffect(() => {
    chatSocket.attach(onChatMessagesChange);

    // Detach observer when component unmounted
    return() => chatSocket.detach(onChatMessagesChange);
  })

  function scrollToBottom(element) {
    if (element != null) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (<div id={styles["chat-body"]} className="py-2 mb-auto" ref={el => scrollToBottom(el)}>{chatMessages}</div>);
}

function ChatBodySearching() {
  return (<div id={styles["chat-body"]}>
    <div id={styles["loader"]}>
      <Rings height="70" width="70" color="#909090" className="justify-content-center" ariaLabel="loading"/>
    </div>
  </div>);
}

function ChatBodyUnavailable() {
  return (<div id={styles["chat-body"]}>
    <p id={styles["failed-chat-body-text"]}>
      No one is available at this moment to connect.
    </p>
    <Link to="/chat" onClick={() => window.location.reload()} className="d-block text-center">
      <button id={styles['start-chat-btn']}>Retry again</button>
    </Link>
  </div>);
}

export default ChatBody;
