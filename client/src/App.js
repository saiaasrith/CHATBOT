import React from "react";
import {Outlet, useLocation} from "react-router-dom";
import {useMediaQuery} from 'react-responsive';
import {ToastContainer} from 'react-toastify';
import Header from "./components/Header";
import Footer from "./components/Footer.js";
import {SocketContext} from "./config/context.js";
import ChatSocket from "./services/chatSocket.js";
import constants from "./config/constants.js";
import "./styles/index.css";

const {io} = require("socket.io-client");

// Initializing socket.io
const socket = io(constants.APP_URL);
const chatSocket = new ChatSocket(io, socket);

function App() {
  const location = useLocation(); // get current component router path object
  const isMobile = useMediaQuery({query: `(max-width: 425px)`});

  let hideHeader = false;
  // Hide header when screen is mobile and current path is "/chat"
  if (location.pathname === '/chat' && isMobile) {
    hideHeader = true;
  }

  return (<div id="app">
    {
      (hideHeader)
        ? null
        : <Header/>
    }
    <div id="container">
      <SocketContext.Provider value={chatSocket}>
        <Outlet/>
      </SocketContext.Provider>
    </div>
    {
      (hideHeader)
        ? null
        : <Footer/>
    }
    <ToastContainer/>
  </div>);
}

export default App;
