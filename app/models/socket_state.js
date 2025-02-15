class SocketState {
  constructor() {
    this.strangersOnlineCount = 0;
    this.strangersAvailable = [];
    this.strangersConnected = {};
    this.strangersConnectedToChatbot = [];
    this.strangersTimeouts = {};
    this.strangersChatBotTimeouts = {};
    this.strangerChatbotMessages = {};
  }
}

module.exports = SocketState;
