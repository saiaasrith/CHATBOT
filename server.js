const express = require("express");
const http = require("http");
const path = require('path');
const cors = require('cors');
const {Server} = require("socket.io");
require("dotenv").config();
const socketHandler = require("./app/socket_handler.js");
const SocketState = require("./app/models/socket_state.js");
const ChatSocketHelper = require("./app/helpers/chat_socket.js");

const PORT = process.env.PORT || 3001;

const app = express();

// Load Router
const appRouter = require('./app/routes/router.js');

app.use(express.json());
app.use(cors())

//  Serving static files
app.use(express.static(path.join(__dirname, 'client/build')));

// Mounting Router
app.use("/api/v1", appRouter);

const server = http.createServer(app);

// Initializing Socket server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const socketState = new SocketState();
const chatSocketHelper = new ChatSocketHelper(socketState);

io.on("connection", socket => {
  socketHandler(io, socket, socketState, chatSocketHelper);
});

//  All other GET requests not handled by server will return the React app
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
