"use client";

import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";

interface Props {
  role: "guest" | "trainee" | "trainer";
  onLogin?: () => void;
  onSignUp?: () => void;
}

export default function UniversalHeader({ role, onLogin, onSignUp }: Props) {

  const renderGuest = () => (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <Image src="/images/logo.png" alt="FitFinder Logo" width={100} height={100} />
      </div>

      <div className={styles.buttonsSection}>
        <button className={styles.btnYellow} onClick={onSignUp}>Sign Up</button>
        <button className={styles.btnYellow} onClick={onLogin}>Log In</button>
      </div>
    </header>
  );

  const renderTrainee = () => (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src="/images/logo.png" alt="FitFinder Logo" width={100} height={100}/>
      </div>

      <nav className={styles.navLinks}>
        <Link href="#" className={styles.active}>חיפוש אימון</Link>
        <span>|</span>
        <Link href="#">האימונים שלי</Link>
        <span>|</span>
        <Link href="#">היסטוריית אימונים</Link>
        <span>|</span>
        <Link href="#">רשימת מועדפים</Link>
      </nav>

      <button className={styles.profileBtn}>מעבר לפרופיל מאמן</button>
    </header>
  );

  const renderTrainer = () => (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src="/images/logo.png" alt="FitFinder Logo" width={100} height={100}/>
      </div>

      <nav className={styles.navLinks}>
        <Link href="#" className={styles.active}>פרטים אישיים</Link>
        <span>|</span>
        <Link href="#">האימונים שלי</Link>
        <span>|</span>
        <Link href="#">ביקורות</Link>
      </nav>

      <button className={styles.profileBtn}>מעבר לפרופיל מתאמן</button>
    </header>
  );

  if (role === "guest") return renderGuest();
  if (role === "trainee") return renderTrainee();
  if (role === "trainer") return renderTrainer();
}
