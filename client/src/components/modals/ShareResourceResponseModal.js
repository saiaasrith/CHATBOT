import React from "react";
import {Modal} from "react-bootstrap";
import styles from "../../styles/modal.module.css";

function ShareResourceResponseModal(props) {
  return (<Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered="centered" dialogClassName={styles["modal-box"]}>
    <Modal.Body>
      <h4 className={styles["title"]}>
        {
          `Stranger wants to share a ${props.resourceType}
            with you`
        }
      </h4>
      <button onClick={props.onHide} className={`${styles["btn"]} ${styles["secondary-btn"]}`}>
        Deny
      </button>
      <button onClick={props.onHide} className={`${styles["btn"]} ${styles["primary-btn"]}`}>
        Approve
      </button>
    </Modal.Body>
  </Modal>);
}

export default ShareResourceResponseModal;
