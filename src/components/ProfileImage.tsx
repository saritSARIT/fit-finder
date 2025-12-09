import { useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./ProfileImage.module.css";

export default function ProfileImage() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return null;
  }

  const profileImageSrc = session.user.image || "/images/UserProfile.png";

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
