"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UniversalHeader from "@/components/header/header";
import styles from "./requestTraining.module.css";
import { traineeStore } from "@/store/traineeStore";
import { showToast } from "@/components/toast/Toast";

export default function RequestTrainingPage() {
  const router = useRouter();
  const trainee = traineeStore(state => state.trainee)
  const [training, setTraining] = useState<any>(null);
  const [selectedType, setSelectedType] = useState("");
  const [trainer, setTrainer] = useState<any>(null)
  const [note, setNote] = useState("");

  useEffect(() => {
    const trainer = localStorage.getItem("selectedTrainer");
    if (!trainer) return;
    const parsedTrainer = JSON.parse(trainer);
    setTrainer(parsedTrainer)

    const training = localStorage.getItem("selectedTraining");
    if (!training) return;
    const parsedTraining = JSON.parse(training);
    setTraining(parsedTraining);

    setSelectedType(parsedTraining.type || parsedTrainer.types[0])
  }, []);

  if (!training) return <div>טוען…</div>;

  const sendRequest = async () => {
    // המערך הקיים ממונגו
    const traineeArray = training.trainees || [];

    // למצוא אם המתאמן כבר נמצא ברשימה
    const exist = traineeArray.find((x: any) => x.id === trainee?.id);

    let updatedTraineeArray;

    if (exist) {
      // אם קיים - נוסיף הערה
      const updated = traineeArray.map((item: any) => {
        if (item.id === trainee?.id) {
          return {
            ...item,
            notes: item.notes ? [...item.notes, note] : [note],
          };
        }
        return item;
      });

      updatedTraineeArray = updated;
    } else {
      // אם לא קיים - מוסיפים אובייקט חדש
      updatedTraineeArray = [
        ...traineeArray,
        {
          id: trainee?.id,
          notes: note ? [note] : [],
          status: "sent",
        },
      ];
    }

    const res = await fetch(`/api/training/${training._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainees: updatedTraineeArray,
        type: selectedType,
      }),
    });

    showToast("הבקשה נשלחה!");
    router.push("/dashboard/trainee/myTrainings");
  };


  return (
    <div className={styles.page}>
      <UniversalHeader role="trainee" />

      <div className={styles.card}>
        <h2 className={styles.title}>הגשת בקשה לאימון</h2>

        <div className={styles.row}>
          <span className={styles.label}>שם המאמן:</span>
          <span>{trainer.name}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>תאריך:</span>
          <span>{training.date}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>  שעה:</span>
          <span>{training.from} - {training.to}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>כתובת:</span>
          <span>{trainer.address}</span>
        </div>

        {training.type ?
          <>
            <div className={styles.row}>
              <span className={styles.label}>סוג אימון:</span>
              <span>{training.type}</span>
            </div>

            <div className={styles.row}>
                <span className={styles.label}></span>
              <span>קבוצתי</span>
            </div>
          </>

          :
          <>
            <div className={styles.row}>
              <span className={styles.label}>בחר סוג אימון:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {trainer.types.map((t: string, index: number) => (
                  <option key={index} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className={styles.row}>
                 <span className={styles.label}></span>
              <span>אישי</span>
            </div>
          </>
        }

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
