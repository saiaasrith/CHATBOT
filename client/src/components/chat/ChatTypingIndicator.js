import styles from "../../styles/chat.module.css";

function ChatTypingIndicator() {
  return (<div className={styles['typing-indicator']}>
    <span></span>
    <span></span>
    <span></span>
  </div>);
}

export default ChatTypingIndicator;
