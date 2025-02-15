import {useState, useEffect} from 'react';
import styles from "../styles/contact.module.css";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contactIllustrationImage from "../images/contact-illustration.svg";
import appTheme from "../config/appTheme.js";
import ApiService from "../services/apiService.js";
import {seo} from '../utils/seo';

function Contact() {
  const [sendButtonLoaderDisplay, setSendButtonLoaderDisplay] = useState(false);

  useEffect(() => {
    seo({title: 'Contact Us | Stranger Talks'});
  });

  return (<div className="container pt-3 pb-5 d-flex justify-content-center justify-content-md-evenly align-items-center flex-wrap flex-md-nowrap">
    <div>
      <img id={styles['contact-illustration']} src={contactIllustrationImage} alt="Contact Illustration"/>
    </div>
    <form onSubmit={submitContactForm}>
      <div className="form-floating mb-3">
        <input type="text" className="form-control" name="fullName" id={styles['name-input']} placeholder="Nitish"/>
        <label htmlFor="name-input">Your Full Name</label>
      </div>
      <div className="form-floating mb-3">
        <input type="text" className="form-control" name="email" id={styles['email-input']} placeholder="name@example.com"/>
        <label htmlFor="email-input">Email Id</label>
      </div>
      <div className="form-floating mb-3">
        <textarea className="form-control" name="message" placeholder="Type your message here" id={styles['message-input']}></textarea>
        <label htmlFor="message-input">Message</label>
      </div>
      <button id={styles['submit-btn']} type="submit" className="btn btn-primary">
        {
          (sendButtonLoaderDisplay)
            ? <span>Sending ...
                <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
              </span>
            : "Send"
        }
      </button>
    </form>
  </div>);

  async function submitContactForm(e) {
    e.preventDefault();
    setSendButtonLoaderDisplay(true);

    const {fullName, email, message} = e.target.elements;

    let formData = {
      fullName: fullName.value,
      email: email.value,
      message: message.value
    }

    try {
      const result = await ApiService.post("contact", formData);
      console.log(result);
      e.target.reset();
      if (result.status === "Success") {
        toast.success(result.message, appTheme.toast);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message, appTheme.toast);
    } finally {
      setSendButtonLoaderDisplay(false);
    }
  }

}

export default Contact;
