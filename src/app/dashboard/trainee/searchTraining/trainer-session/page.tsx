"use client";

import React, { useEffect, useState } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./trainerSession.module.css";
import { useRouter } from "next/navigation"; 

type Session = {
  id: string;
  trainerName: string;
  location: string;
  date: string;
  from: string;
  to: string;
  types: string[];
  personal: boolean;
  group: boolean;
};

export default function TrainerSessionPage({ params }: any) {
  const { id } = params;
  const router = useRouter();               

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const fakeData: Session = {
        id,
        trainerName: "שם המאמן לדוגמה",
        location: "דיזנגוף 200, תל אביב",
        date: "2025-01-12",
        from: "18:00",
        to: "19:00",
        types: ["יוגה", "פילאטיס"],
        personal: true,
        group: false,
      };

      setSession(fakeData);
    };

    fetchSession();
  }, [id]);

  if (!session) return <div>טוען…</div>;

  return (
    <div className={styles.page}>
      <UniversalHeader role="trainee" />

      <div className={styles.card}>
        <h2 className={styles.title}>פרטי אימון</h2>

        <div className={styles.row}>
          <span className={styles.label}>שם המאמן:</span>
          <span>{session.trainerName}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>מיקום אימון:</span>
          <span>{session.location}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>תאריך:</span>
          <span>{session.date}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>שעות:</span>
          <span>
            {session.from} - {session.to}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>סוגי אימון:</span>
          <span>{session.types.join(", ")}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>אופי אימון:</span>
          <span>
            {session.personal && "אישי "}
            {session.group && "קבוצתי "}
          </span>
        </div>

        <button
        //   className={styles.requestBtn}
        //   onClick={() => router.push(`/request-training/${id}`)}
        >
          בקשת אימון
        </button>
      </div>
    </div>
  );
}
