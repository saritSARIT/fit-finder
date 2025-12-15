import { useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./ProfileImage.module.css";
import { traineeStore } from "@/store/traineeStore";

export default function ProfileImage() {
  const { data: session } = useSession();
  const trainee = traineeStore((s) => s.trainee);

  // Prefer persisted trainee store data (immediate after register), fall back to session
  const profileImageSrc = trainee?.image || session?.user?.image || "/images/UserProfile.png";

  return (
    <div className={styles.profileImageWrapper}>
      <Image
        src={profileImageSrc}
        alt="תמונת פרופיל"
        width={40}
        height={40}
        className={styles.profileImage}
      />
    </div>
  );
}
