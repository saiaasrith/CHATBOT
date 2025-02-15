import {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import styles from "../styles/blog.module.css";
import blogPosts from "../static/blogPosts.js";
import constants from "../config/constants.js";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import appTheme from "../config/appTheme.js";
import ApiService from "../services/apiService.js";
import {seo} from '../utils/seo';

function Blog() {
  const isMounted = useRef(true);
  const navigate = useNavigate();
  const [chatButtonLoaderDisplay, setChatButtonLoaderDisplay] = useState(false);

  useEffect(() => {
    seo({title: 'Blog | Stranger Talks'});
    return() => {
      isMounted.current = false;
    };
  });

  const blogPostsHTML = blogPosts.map((post, index) => <section key={index}>
    <h4>{post.heading}</h4>
    <div dangerouslySetInnerHTML={{
        __html: post.body
      }}></div>
    <button id={styles['start-chat-btn']} className="btn btn-primary" type="button" onClick={(e) => navigateToChat(e)}>
      Connect with Stranger {
        (chatButtonLoaderDisplay)
          ? <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
          : null
      }
    </button>
  </section>);

  return (<div className="container pt-1 pb-5">
    <h1 id={styles['title']}>BLOG</h1>
    <div id={styles['blog-container']}>
      {blogPostsHTML}
    </div>
  </div>);

  function navigateToChat(e) {
    e.preventDefault();
    setChatButtonLoaderDisplay(true);
    window.grecaptcha.ready(function() {
      window.grecaptcha.execute(constants.G_RECAPTCHA_SITE_KEY, {action: 'submit'}).then(function(token) {
        verifyRecaptchaToken(token);
      });
    });
  }

  async function verifyRecaptchaToken(token) {
    try {
      const result = await ApiService.post("recaptcha/verify", {'g_recaptcha_token': token});

      if (result.status === "Success") {
        navigate('/chat');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, appTheme.toast);
    } finally {
      if (isMounted.current) {
        setChatButtonLoaderDisplay(false);
      }
    }
  }
}

export default Blog;
