import styles from './footer.module.css';
import logo from '../../../public/images/ff-white.png';


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>תנאי שימוש</p>
      <img src={logo.src} alt="Logo" className={styles.logo} width={70} style={{opacity: 0.9}} />
    </footer>
  );
}