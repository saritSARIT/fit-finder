import styles from './footer.module.css';
import logo from '../../../public/images/ff-white.png';

import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      
      <p>תנאי שימוש</p>

      {/* אייקונים במרכז */}
      <div className={styles.social}>
        <a href="https://facebook.com" target="_blank"><FaFacebook /></a>
        <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
        <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
        <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
        <a href="https://tiktok.com" target="_blank"><FaTiktok /></a>
      </div>

      {/* לוגו בצד */}
      <img 
        src={logo.src} 
        alt="Logo" 
        width={80} 
        style={{ opacity: 0.9 }} 
      />

    </footer>
  );
}
