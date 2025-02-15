import {useContext, useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {SocketContext} from "../../config/context.js";
import styles from "../../styles/chat.module.css";
import closeIcon from "../../images/close-icon.svg";
import errorIcon from "../../images/error-icon.svg";
import successIcon from "../../images/success-icon.svg";
import searchIcon from "../../images/search-icon.svg";

function ChatHeader() {

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
    return <ChatHeaderConnected/>;
  } else if (chatStatus === "Searching") {
    return <ChatHeaderSearching/>;
  } else if (chatStatus === "Unavailable") {
    return <ChatHeaderUnavailable/>;
  } else {
    return <ChatHeaderDisconnected/>;
  }

}

function ChatHeaderConnected() {
  return (<div id={styles["chat-header"]} className="d-flex justify-content-between align-items-center">
    <div className="flex-fill">
      <img src={successIcon} id={styles["chat-header-icon-success"]} alt="Chat Header Icon"/>
      <div className={styles["chat-header-main"]}>
        <h5 className={styles["chat-header-title"]}>Connected!</h5>
        <p className={styles["chat-header-sub-title"]}>
          You can start sending messages to the stranger now
        </p>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function ChatHeaderSearching() {
  return (<div id={styles["chat-header"]} className="d-flex justify-content-between align-items-center">
    <div className="flex-grow-1">
      <img src={searchIcon} id={styles["chat-header-icon-search"]} alt="Chat Header Icon"/>
      <div className={styles["chat-header-main"]}>
        <h5 className={styles["chat-header-title"]}>Searching...</h5>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function ChatHeaderUnavailable() {
  return (<div id={styles["chat-header"]} className="d-flex justify-content-between align-items-center">
    <div className="flex-fill">
      <img src={errorIcon} id={styles["chat-header-icon-error"]} alt="Chat Header Icon"/>
      <div className={styles["chat-header-main"]}>
        <h5 className={styles["chat-header-title"]}>
          No strangers available at this moment
        </h5>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function ChatHeaderDisconnected() {
  return (<div id={styles["chat-header"]} className="d-flex justify-content-between align-items-center">
    <div className="flex-fill">
      <img src={errorIcon} id={styles["chat-header-icon-error"]} alt="Chat Header Icon"/>
      <div className={styles["chat-header-main"]}>
        <h5 className={styles["chat-header-title"]}>
          Chat Disconnected
        </h5>
      </div>
    </div>
    <CloseChatButton/>
  </div>);
}

function CloseChatButton() {
  return (<Link to="/" className="m-auto m-sm-0">
    <img className={styles["close-chat-icon"]} src={closeIcon} alt="Close Chat Icon"/>
  </Link>);
}

export default ChatHeader;
