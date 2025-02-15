import React from 'react'
import logo from "../images/logo.svg";
import styles from "../styles/header.module.css";
import {Link} from "react-router-dom";
import {Navbar, Container} from 'react-bootstrap';

class Header extends React.Component {
  render() {
    return (<Navbar sticky="fixed" className="py-3">
      <Container>
        <Navbar.Brand className="mx-auto">
          <Link to="/">
            <img id={styles.logo} alt="App Logo" src={logo} className="d-inline-block align-top"/>
          </Link>
          <span id={styles.title}>Stranger Talks</span>
        </Navbar.Brand>
      </Container>
    </Navbar>);
  }
}

export default Header;
