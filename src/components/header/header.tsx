"use client";

import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { moveToTrainer } from "@/services/trainerService";
import { useRouter } from "next/navigation";
import { traineeStore } from "@/store/traineeStore";
import { usePathname } from "next/navigation";
import Logout from "../Logout";

interface Props {
  role: "guest" | "trainee" | "trainer";
  onLogin?: () => void;
  onSignUp?: () => void;
}


export default function UniversalHeader({ role, onLogin, onSignUp }: Props) {

  const trainee = traineeStore((state) => state.trainee);
  const router = useRouter();
  const pathname = usePathname();

  const goToTrainer = () => {
    moveToTrainer(
      trainee?.id || "",
      trainee?.email || "",
      trainee?.name || "");
    router.push("/dashboard/trainer/personalDetails");
  };

  const goToTrainee = () => {
    router.push("/dashboard/trainee/searchTraining");
  }

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
        <img src="/images/logo.png" alt="FitFinder Logo" width={100} height={100} />
      </div>

      <nav className={styles.navLinks}>
        <Link
          href="/dashboard/trainee/searchTraining"
          className={pathname.includes("searchTraining") ? styles.active : ""}
        >
          חיפוש אימון
        </Link>
        <span>|</span>
        <Link
          href="/dashboard/trainee/myTrainings"
          className={pathname.includes("myTrainings") ? styles.active : ""}
        >
          האימונים שלי
        </Link>
        <span>|</span>
        <Link
          href="/dashboard/trainee/trainingsHistory"
          className={pathname.includes("trainingsHistory") ? styles.active : ""}
        >
          היסטוריית אימונים
        </Link>



      </nav>
      <div className={styles.logoutSection}>

        <span  className={styles.name}>הי,{trainee?.name}</span>
       
        <Logout />
      </div>


      <button className={styles.profileBtn}
        onClick={() => goToTrainer()}
      >
        מעבר לפרופיל מאמן
      </button>
    </header>
  );

  const renderTrainer = () => (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src="/images/logo.png" alt="FitFinder Logo" width={100} height={100} />
      </div>

      <nav className={styles.navLinks}>
        <Link
          href="/dashboard/trainer/personalDetails"
          className={pathname.includes("personalDetails") ? styles.active : ""}
        >
          פרטים אישיים
        </Link>
        <span>|</span>
        <Link
          href="/dashboard/trainer/myTrainings"
          className={pathname.includes("myTrainings") ? styles.active : ""}
        >
          האימונים שלי
        </Link>
        <span>|</span>
        <Link
          href="/dashboard/trainer/comments"
          className={pathname.includes("comments") ? styles.active : ""}
        >
          ביקורות
        </Link>
      </nav>
      <div className={styles.logoutSection}>
        <span className={styles.name}>הי,{trainee?.name}</span>
        
        <Logout />
      </div>


      <button
        className={styles.profileBtn}
        onClick={() => goToTrainee()}
      >
        מעבר לפרופיל מתאמן
      </button>
    </header>
  );

  if (role === "guest") return renderGuest();
  if (role === "trainee") return renderTrainee();
  if (role === "trainer") return renderTrainer();
}
