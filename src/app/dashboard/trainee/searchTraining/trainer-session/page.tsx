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

  const [trainer, setTrainer] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedTrainer");
    if (saved) setTrainer(JSON.parse(saved));
  }, []);

  if (!trainer) return <p>טוען...</p>;


  return (
    <div className={styles.page}>
      <UniversalHeader role="trainee" />

      <div className={styles.card}>
        <h2 className={styles.title}>פרטי המאמן</h2>

        <div className={styles.row}>
          <span className={styles.label}>שם המאמן:</span>
          <span>{trainer.name}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>אימייל:</span>
          <span>{trainer.email}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>מיקום אימון:</span>
          <span>{trainer.address}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>סוגי אימון:</span>
          <span>{trainer.types.join(", ")}</span>
        </div>

        <button
          className={styles.requestBtn}
          onClick={() => router.push(`trainer-session/request-training`)}
        >
          בקשת אימון
        </button>
      </div>
    </div>
  );
}
