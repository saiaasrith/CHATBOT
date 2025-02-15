import {Link} from "react-router-dom";
import styles from "../styles/footer.module.css";

function Footer() {
  return (<footer>
    <div className="d-flex flex-wrap justify-content-center align-items-center">
      <Link to="terms-and-conditions" className={styles['footer-links']}>Terms & Conditions</Link>
      <Link to="blog" className={styles['footer-links']}>Blog</Link>
      <Link to="contact" className={styles['footer-links']}>Contact</Link>
      <Link to="privacy-policy" className={styles['footer-links']}>Privacy Policy</Link>
    </div>
    <p>Stranger Talks | &#169; Copyright 2022</p>
  </footer>);

}

export default Footer;
