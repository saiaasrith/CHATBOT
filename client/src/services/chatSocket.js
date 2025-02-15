// Chat Socket Model and Subject in Observer Pattern
class ChatSocket {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.strangersOnlineCount = 0;
    this.chatStatus = "Searching";
    this.isStrangerTyping = false;
    this.messagesList = []; // [{message : "Hello", party : "Sender"}, {message : "Hey", party : "Receiver"}]
    this.registerChatSocketListeners();

    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observerToRemove) {
    this.observers = this.observers.filter(observer => observerToRemove !== observer);
  }

  notify() {
    this.observers.forEach(observer => {
      observer();
    });
  }

  registerChatSocketListeners() {
    this.socket.on("chat:strangers-online", function(strangersOnlineCount) {
      console.log("Stranger Online Count : ", strangersOnlineCount);
      this.strangersOnlineCount = strangersOnlineCount;
      this.notify();
    }.bind(this));

    this.socket.on("chat:searching", function() {
      console.log("Searching for Stranger");
      this.chatStatus = "Searching";
      this.notify();
    }.bind(this));

    this.socket.on("chat:connected", function() {
      console.log("Stranger Connected");
      this.chatStatus = "Connected";
      this.messagesList = []; // clear messages list
      this.notify();
    }.bind(this));

    this.socket.on("chat:unavailable", function() {
      console.log("Stranger Unavailable");
      this.chatStatus = "Unavailable";
      this.notify();
    }.bind(this));

    this.socket.on("chat:disconnected", function() {
      console.log("Stranger Disconnected");
      this.chatStatus = "Disconnected";
      this.notify();
    }.bind(this));

    this.socket.on("chat:typing", function(isStrangerTyping) {
      console.log("Stranger is typing");
      this.isStrangerTyping = isStrangerTyping;
      this.notify();
    }.bind(this));

    this.socket.on("chat:message", function(message) {
      console.log("Stranger Message Received: ", message);
      this.messagesList.push({message, "party": "Receiver"});
      this.notify();
    }.bind(this));
  }

  connectStranger() {
    console.log("Chat Connecting");
    this.socket.emit('chat:connect');
  }

  typingMessage(isStrangerTyping) {
    console.log("Stranger is typing: ", isStrangerTyping);
    this.socket.emit('chat:typing', isStrangerTyping);
    this.notify();
  }

  sendMessage(message) {
    console.log("Chat Message Sent: ", message);
    this.socket.emit('chat:message', message);
    this.notify();
  }

  disconnectChat() {
    console.log("Chat Disconnected");
    this.socket.emit('chat:disconnect');
  }
}

export default ChatSocket;
