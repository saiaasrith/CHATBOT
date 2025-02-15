const axios = require("axios");
const EmailHelper = require("./helpers/emailer.js");

module.exports = (io, socket, socketState, chatSocketHelper) => {
  console.log("Chat Socket: Stranger connected to socket server, ", new Date().toISOString());

  chatSocketHelper.increaseStrangerOnlineCount(socketState);

  emitStrangersOnlineCount();

  /* --------------------- LISTENERS --------------------- */

  socket.on("chat:connect", connect);

  socket.on("chat:message", message);

  socket.on("chat:typing", typing);

  socket.on("chat:disconnect", () => {
    disconnect();
  });

  socket.on("disconnect", () => {
    chatSocketHelper.decreaseStrangerOnlineCount();
    disconnect();
  });

  /* --------------------- HANDLERS --------------------- */

  function connect() {
    console.log("Chat Socket: Stranger connecting to chat, ", new Date().toISOString());

    // if (socketState.strangersOnlineCount == 1) {
    EmailHelper.sendEmail("User connecting to chat | Stranger Talks", " <b>Open app now to chat with stranger</b>");
    // }

    io.to(socket.id).emit("chat:searching"); // emit to socket

    // disconnect earlier chat is exists
    disconnect();

    if (socketState.strangersAvailable.length != 0) {
      // Pick random stranger
      let randomStranger = chatSocketHelper.getRandomStranger(socketState);

      // Map connected strangers
      chatSocketHelper.mapConnectedStrangers(socket.id, randomStranger);

      // Remove picked random stranger from socketState.strangersAvailable array
      chatSocketHelper.removeStrangerFromAvailableList(randomStranger);

      io.to(socket.id).emit("chat:connected");
      io.to(randomStranger).emit("chat:connected");

      // Clear timeout created for random stranger
      let randomStrangerTimeout = socketState.strangersTimeouts[randomStranger];
      clearTimeout(randomStrangerTimeout);

      // Clear chatbot timeout created for random stranger
      let randomStrangerChatBotTimeout = socketState.strangersChatBotTimeouts[randomStranger];
      clearTimeout(randomStrangerChatBotTimeout);

      console.log("Chat Socket: Stranger connected, ", new Date().toISOString());
      return;
    }

    socketState.strangersAvailable.push(socket.id);

    const timeout = setTimeout(() => {
      // If stranger is not connected within set duration,
      // emit unavailable
      if (chatSocketHelper.isStrangerChatActive(socket.id) == false) {
        console.log("Chat Socket: Stranger could not connect to chat, ", new Date().toISOString());
        // Remove stranger from socketState.strangersAvailable array
        chatSocketHelper.removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:unavailable");
      }
    }, process.env.STRANGER_SEARCH_DURATION);

    const chatBotTimeout = setTimeout(() => {
      // If stranger is not connected within set duration,
      // connet the stranger to chatbot
      if (chatSocketHelper.isStrangerChatActive(socket.id) == false) {
        console.log("Chat Socket: Stranger connected to chat bot, ", new Date().toISOString());
        // Add stranger to chatbot list
        socketState.strangersConnectedToChatbot.push(socket.id);

        // Remove picked random stranger from socketState.strangersAvailable array
        chatSocketHelper.removeStrangerFromAvailableList(socket.id);

        io.to(socket.id).emit("chat:connected");

        // Send "Hi" message to stranger if they dont send a message after 5 seconds
        setTimeout(() => {
          sendFirstChatbotMessage(socket.id);
        }, 5000);

        // Clear timeout created for random stranger
        let randomStrangerTimeout = socketState.strangersTimeouts[socket.id];
        clearTimeout(randomStrangerTimeout);

        EmailHelper.sendEmail("User connected to Chatbot | Stranger Talks", "<b>A stranger is connected to chatbot</b>");

      }
    }, 10000);

    // Save the timeout created for current socket, to clear it later if needed
    socketState.strangersTimeouts[socket.id] = timeout;

    // Save the chatbot timeout created for current socket, to clear it later if needed
    socketState.strangersChatBotTimeouts[socket.id] = chatBotTimeout;

  }

  function typing(isStrangerTyping) {
    console.log("Chat Socket: Stranger is typing, ", new Date().toISOString());

    let senderSocketId = socket.id;
    let receiverSocketId = socketState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:typing", isStrangerTyping);
  }

  function message(message) {
    console.log("Chat Socket: Strager sent chat message, ", new Date().toISOString());

    // if the stranger is connected to chatbot
    if (socketState.strangersConnectedToChatbot.includes(socket.id)) {
      sendChatbotResponse(message, socket.id);
      return;
    }

    let senderSocketId = socket.id;
    let receiverSocketId = socketState.strangersConnected[senderSocketId];
    if (receiverSocketId == null) {
      io.to(senderSocketId).emit("chat:disconnect");
      return;
    }
    io.to(receiverSocketId).emit("chat:message", message);
  }

  function emitStrangersOnlineCount() {
    console.log("Chat Socket: Strangers online count: " + socketState.strangersOnlineCount + ", ", new Date().toISOString());

    // Emit to socket the count of strangers online
    // io.emit("chat:strangers-online", socketState.strangersOnlineCount);

    //Emit random count (for user retaining purpose)
    io.emit("chat:strangers-online", Math.floor(Math.random() * 10) + 9 + socketState.strangersOnlineCount);
  }

  function disconnect() {
    console.log("Chat Socket: Stranger disconnected the chat, ", new Date().toISOString());

    emitStrangersOnlineCount();

    // If stranger is connected to another stranger before disconnecting
    if (chatSocketHelper.isStrangerChatActive(socket.id)) {
      var randomStranger = socketState.strangersConnected[socket.id];

      // Remove mapping of connected strangers
      chatSocketHelper.deMapConnectedStrangers(socket.id, randomStranger);

      io.to(socket.id).emit("chat:disconnected");
      io.to(randomStranger).emit("chat:disconnected");
    }

    // Remove stranger from socketState.strangersAvailable array
    chatSocketHelper.removeStrangerFromAvailableList(socket.id);

    // Email chat messages if stranger connected to chatbot
    if (socketState.strangerChatbotMessages[socket.id] != undefined) 
      sendEmailToNotifyStrangerChatbotMessages(socket.id);
    
    // Remove stranger from socketState.strangersConnectedToChatbot array
    chatSocketHelper.removeStrangerFromChatbotList(socket.id);

    // Remove connected random stranger from socketState.strangersAvailable array if undefined
    if (typeof randomStranger != "undefined") {
      chatSocketHelper.removeStrangerFromAvailableList(randomStranger);
    }
  }

  /* --------------------- HELPERS --------------------- */

  function sendChatbotResponse(message, strangerSocketId) {
    if (socketState.strangerChatbotMessages[strangerSocketId] === undefined) {
      socketState.strangerChatbotMessages[strangerSocketId] = [];
    }
    // Store chat messages
    socketState.strangerChatbotMessages[strangerSocketId].push({"sender": "Stranger", "message": message});

    // Emit typing event after 2 seconds
    setTimeout(function() {
      io.to(strangerSocketId).emit("chat:typing", true);
    }, 2000);

    axios.get(`http://api.brainshop.ai/get?bid=167785&key=YeHfLoiHjSvbjqSs&uid=${strangerSocketId}&msg=${message}`).then(function(response) {
      // Send message to stranger after 5 seconds
      setTimeout(function() {
        io.to(strangerSocketId).emit("chat:typing", false);
        io.to(strangerSocketId).emit("chat:message", response.data.cnt);
      }, 5000);
      socketState.strangerChatbotMessages[strangerSocketId].push({"sender": "Chatbot", "message": response.data.cnt});
    }).catch(function(error) {
      // handle error
      console.log("Chat Socket: Error from chatbot : ", error.response.data, " , ", new Date().toISOString());
      io.to(strangerSocketId).emit("chat:disconnected");
      // Remove stranger from socketState.strangersConnectedToChatbot array
      chatSocketHelper.removeStrangerFromChatbotList(strangesocketState, rSocketId);
    });
  }

  function sendFirstChatbotMessage(strangerSocketId) {
    io.to(strangerSocketId).emit("chat:typing", true);
    setTimeout(function() {
      if (socketState.strangerChatbotMessages[strangerSocketId] === undefined) {
        io.to(strangerSocketId).emit("chat:typing", false);
        io.to(strangerSocketId).emit("chat:message", "Hi");
      }
    }, 1000);
  }

  function sendEmailToNotifyStrangerChatbotMessages(strangerSocketId) {
    let chatMessages = socketState.strangerChatbotMessages[strangerSocketId];
    let emailBody = "";
    for (let message of chatMessages) {
      emailBody += "<b>" + message["sender"] + "</b> : " + message["message"] + "<br>"
    }
    EmailHelper.sendEmail("User and Chatbot chat | Stranger Talks", emailBody);
    // Remove chat messages
    delete socketState.strangerChatbotMessages[strangerSocketId];
  }
};
