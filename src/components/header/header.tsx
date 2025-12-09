"use client";

import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { moveToTrainer } from "@/services/trainerService";
import { useRouter, usePathname } from "next/navigation";
import { traineeStore } from "@/store/traineeStore";
import { useState } from "react";
import Logout from "../Logout";
import ProfileImage from "../ProfileImage";
import ConfirmDialog from "../profile/ConfirmDialog";
import EditProfileModal from "../profile/EditProfileModal";

interface Props {
  role: "guest" | "trainee" | "trainer";
  onLogin?: () => void;
  onSignUp?: () => void;
}

export default function UniversalHeader({ role, onLogin, onSignUp }: Props) {
  const trainee = traineeStore((state) => state.trainee);
  const router = useRouter();
  const pathname = usePathname();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmRole, setConfirmRole] = useState<"trainer" | "trainee" | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const confirmMove = () => {
    if (confirmRole === "trainer") {
      moveToTrainer(
        trainee?.id || "",
        trainee?.email || "",
        trainee?.name || "",
      );
      router.push("/dashboard/trainer/personalDetails");
    }

    if (confirmRole === "trainee") {
      router.push("/dashboard/trainee/searchTraining");
    }

    setShowConfirm(false);
  };

  const openConfirmDialog = (roleTarget: "trainer" | "trainee") => {
    setConfirmRole(roleTarget);
    setShowConfirm(true);
  };

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
        <Link href="/dashboard/trainee/searchTraining" className={pathname.includes("searchTraining") ? styles.active : ""}>
          חיפוש אימון
        </Link>
        <span>|</span>
        <Link href="/dashboard/trainee/myTrainings" className={pathname.includes("myTrainings") ? styles.active : ""}>
          האימונים שלי
        </Link>
        <span>|</span>
        <Link href="/dashboard/trainee/trainingsHistory" className={pathname.includes("trainingsHistory") ? styles.active : ""}>
          היסטוריית אימונים
        </Link>
      </nav>

      <div className={styles.logoutSection}>
        <button 
          className={styles.profileImageBtn}
          onClick={() => setShowProfileModal(true)}
        >
          <ProfileImage />
        </button>
        <span className={styles.name}>{trainee?.name}</span>
      </div>

      {/* <button
        className={styles.profileBtn}
        onClick={() => openConfirmDialog("trainer")}
      >
        מעבור לפרופיל מאמן
      </button> */}
    </header>
  );

  const renderTrainer = () => (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src="/images/logo.png" alt="FitFinder Logo" width={100} height={100} />
      </div>

      <nav className={styles.navLinks}>
        <Link href="/dashboard/trainer/personalDetails" className={pathname.includes("personalDetails") ? styles.active : ""}>
          פרטים אישיים
        </Link>
        <span>|</span>
        <Link href="/dashboard/trainer/myTrainings" className={pathname.includes("myTrainings") ? styles.active : ""}>
          האימונים שלי
        </Link>
        <span>|</span>
        <Link href="/dashboard/trainer/trainingsHistory" className={pathname.includes("trainingsHistory") ? styles.active : ""}>
          היסטוריית אימונים
        </Link>
        <span>|</span>
        <Link href="/dashboard/trainer/comments" className={pathname.includes("comments") ? styles.active : ""}>
          ביקורות
        </Link>
      </nav>

      <div className={styles.logoutSection}>
        <button 
          className={styles.profileImageBtn}
          onClick={() => setShowProfileModal(true)}
        >
          <ProfileImage />
        </button>
        <span className={styles.name}>{trainee?.name}</span>
      </div>

      {/* <button
        className={styles.profileBtn}
        onClick={() => openConfirmDialog("trainee")}
      >
        מעבור לפרופיל מתאמן
      </button> */}
    </header>
  );

  return (
    <>
      {role === "guest" && renderGuest()}
      {role === "trainee" && renderTrainee()}
      {role === "trainer" && renderTrainer()}

      <ConfirmDialog
        isOpen={showConfirm}
        title="אישור"
        message="האם את בטוחה שברצונך לעבור?"
        cancelText="ביטול"
        confirmText="אישור"
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmMove}
      />

      {showProfileModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
          <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowProfileModal(false)}>✕</button>
            <div className={styles.profileModalContent}>
              <div className={styles.profileHeader}>
                <ProfileImage />
                <h2>{trainee?.name}</h2>
              </div>
              
              <EditProfileModal 
                isInline={true}
                onSave={() => setShowProfileModal(false)}
              />

              <button 
                className={styles.toggleRoleBtn}
                onClick={() => {
                  if (role === "trainee") {
                    openConfirmDialog("trainer");
                  } else {
                    openConfirmDialog("trainee");
                  }
                  setShowProfileModal(false);
                }}
              >
                {role === "trainee" ? " עבור לפרופיל מאמן" : " עבור לפרופיל מתאמן"}
              </button>

              <div className={styles.logoutButtonWrapper}>
                <Logout />
              </div>
            </div>
          </div>
        </div>
      )}

      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
    </>
  );
}
