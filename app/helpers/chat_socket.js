class ChatSocketHelper {
  constructor(socketState) {
    this.socketState = socketState;
  }

  // Picks random stranger from list of strangers available to connect
  getRandomStranger() {
    return this.socketState.strangersAvailable[
      Math.floor(Math.random() * this.socketState.strangersAvailable.length)
    ];
  }

  removeStrangerFromAvailableList(strangerSocketId) {
    const index = this.socketState.strangersAvailable.indexOf(strangerSocketId);
    if (index > -1) {
      this.socketState.strangersAvailable.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  removeStrangerFromChatbotList(strangerSocketId) {
    const index = this.socketState.strangersConnectedToChatbot.indexOf(
      strangerSocketId
    );
    if (index > -1) {
      console.log(
        "Chat Socket: Removing stranger of chatbot connected list, ",
        new Date().toISOString()
      );
      this.socketState.strangersConnectedToChatbot.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  isStrangerChatActive(strangerSocketId) {
    return this.socketState.strangersConnected.hasOwnProperty(strangerSocketId);
  }

  mapConnectedStrangers(stranger1, stranger2) {
    this.socketState.strangersConnected[stranger1] = stranger2;
    this.socketState.strangersConnected[stranger2] = stranger1;
  }

  deMapConnectedStrangers(stranger1, stranger2) {
    delete this.socketState.strangersConnected[stranger1];
    delete this.socketState.strangersConnected[stranger2];
  }

  increaseStrangerOnlineCount() {
    // Increment the count of strangers online
    this.socketState.strangersOnlineCount++;
  }

  decreaseStrangerOnlineCount() {
    // Decrement the count of strangers online
    this.socketState.strangersOnlineCount--;
  }
}

module.exports = ChatSocketHelper;
