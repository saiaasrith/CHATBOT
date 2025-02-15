import {useContext, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {SocketContext} from "../config/context.js";
import ChatHeader from "../components/chat/ChatHeader";
import ChatBody from "../components/chat/ChatBody";
import ChatFooter from "../components/chat/ChatFooter";
import styles from "../styles/chat.module.css";
import {seo} from '../utils/seo';

function Chat() {
  const chatSocket = useContext(SocketContext);

  useEffect(() => {
    seo({title: 'Chat | Stranger Talks'});
    // Emit event to connect to stranger
    chatSocket.connectStranger();

    // Detach observer when component unmounted
    return() => {
      chatSocket.disconnectChat();
    };
  })

  return (<div>
    <Container id={styles['chat-container']} className="d-flex flex-column justify-content-between">
      <ChatHeader/>
      <ChatBody/>
      <ChatFooter/>
    </Container>
  </div>);
}

export default Chat;
