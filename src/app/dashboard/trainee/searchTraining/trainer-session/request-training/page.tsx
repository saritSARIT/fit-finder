"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UniversalHeader from "@/components/header/header";
import styles from "./requestTraining.module.css";

type SessionData = {
  trainerName: string;
  address: string;
  from: string;
  to: string;
  types: string[];
};

export default function RequestTrainingPage({ params }: any) {
  const { id } = params;
  const router = useRouter();

  const [session, setSession] = useState<SessionData | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // כאן לחבר ל־API שלך
    const fake = {
      trainerName: "שם המאמן לדוגמה",
      address: "רחוב החשמונאים 91, תל אביב",
      from: "18:00",
      to: "19:00",
      types: ["יוגה", "קרוספיט", "אישי"],
    };
    setSession(fake);
  }, [id]);

  if (!session) return <div>טוען…</div>;

  const sendRequest = () => {
    alert("הבקשה נשלחה!");
    router.push("/dashboard/trainee/myTrainings");
  };

  return (
    <div className={styles.page}>
      <UniversalHeader role="trainee" />

      <div className={styles.card}>
        <h2 className={styles.title}>הגשת בקשה לאימון</h2>

        <div className={styles.row}>
          <span className={styles.label}>שם המאמן:</span>
          <span>{session.trainerName}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>כתובת:</span>
          <span>{session.address}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>משעה עד שעה:</span>
          <span>{session.from} - {session.to}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>סוג אימון:</span>

          <select
            className={styles.select}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">בחר סוג אימון</option>
            {session.types.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.column}>
          <span className={styles.label}>הערות:</span>
          <textarea
            className={styles.textarea}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button className={styles.submitBtn} onClick={sendRequest}>
          שליחה
        </button>
      </div>
    </div>
  );
}
