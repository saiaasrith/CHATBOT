import React from 'react';
import styles from "../../styles/chat.module.css";

class ChatMetaMsg extends React.Component {

  render() {
    return (<div className={styles["chat-meta-msg"]}>
      {this.props.message}
    </div>);
  }
}

export default ChatMetaMsg;
