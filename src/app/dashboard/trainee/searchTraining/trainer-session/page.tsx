"use client";

import React, { useEffect, useState } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./trainerSession.module.css";
import { useRouter } from "next/navigation";
import { getTrainerTrainings } from "@/services/trainerService"
import { traineeStore } from "@/store/traineeStore";

export default function TrainerSessionPage() {
  const router = useRouter();
  const [trainer, setTrainer] = useState<any>(null);
  const [trainings, setTrainings] = useState<any[]>([]);
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const trainee = traineeStore(state => state.trainee)

  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem("selectedTrainer");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setTrainer(parsed);
      try {
        const data = await getTrainerTrainings(parsed._id);
        setTrainings(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const goToRequestTraining = (t: any) => {
    localStorage.setItem("selectedTraining", JSON.stringify(t))
    router.push(`trainer-session/request-training`);
  }

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
        <h3>מערכת שעות</h3>
        {trainings.length === 0 ? <p>אין אימונים זמינים</p> :
          <table>
            <thead>
              <tr>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {days.map((_, dayIndex) => (
                  <td key={dayIndex}>
                    {trainings
                      .filter((t) => t.day === dayIndex)
                      .map((t, i) => (
                        <div key={i}>
                          <p>{t.from} - {t.to}</p>
                          {t.classType === "personal" && t.traineeId?.length > 0 ?
                            <>
                              <p>אישי- </p>
                              {t.traineeId[0] === trainee?.id ? <span>{t.status}</span> : <span>תפוס</span>}
                            </>
                            : t.classType === "personal" ?
                              <>
                                <p>אישי</p>
                                <button
                                  onClick={() => goToRequestTraining(t)}
                                >
                                  בקשת אימון
                                </button>
                              </>
                              :
                              <>
                                <p>קבוצתי</p>
                                <p>{t.type}</p>
                                <button
                                  onClick={() => goToRequestTraining(t)}
                                >
                                  בקשת אימון
                                </button>
                              </>
                          }
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
