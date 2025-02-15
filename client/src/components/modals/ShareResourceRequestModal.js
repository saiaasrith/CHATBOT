import React from "react";
import {Modal} from "react-bootstrap";
import styles from "../../styles/modal.module.css";

function ShareResourceRequestModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered="centered"
      dialogClassName={styles["modal-box"]}
    >
      <Modal.Body>
        <h4 className={styles["title"]}>
          Send request to stranger for sharing {props.resourceType}?
        </h4>
        <p className={styles["description"]}>
          Before you can share a {props.resourceType} with a stranger, they
          would have to approve your request.
        </p>
        <button
          onClick={props.onHide}
          className={`${styles["btn"]} ${styles["secondary-btn"]}`}
        >
          Cancel
        </button>
        <button
          onClick={props.onHide}
          className={`${styles["btn"]} ${styles["primary-btn"]}`}
        >
          Send
        </button>
      </Modal.Body>
    </Modal>
  );
}

export default ShareResourceRequestModal;
