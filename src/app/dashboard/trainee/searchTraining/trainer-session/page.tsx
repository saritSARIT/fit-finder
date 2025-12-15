"use client";

import React, { useEffect, useState } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./trainerSession.module.css";
import { useRouter } from "next/navigation";
import { getTrainerTrainings } from "@/services/trainerService"
import { traineeStore } from "@/store/traineeStore";
import { getNextDateForDay } from "@/lib/functions/trainingsDates";

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

  const isTrainingInFuture = (training: any) => {
    const now = new Date();

    const [hoursFrom, minutesFrom] = training.from.split(":").map(Number);
    const trainingDateTime = new Date(training.date);
    trainingDateTime.setHours(hoursFrom, minutesFrom, 0, 0);

    return trainingDateTime >= now;
  };

  const goToRequestTraining = (t: any) => {
    localStorage.setItem("selectedTraining", JSON.stringify(t))
    router.push(`trainer-session/request-training`);
  }

  if (!trainer) return <p>טוען...</p>;

  const currentDayIndex = new Date().getDay();

  return (
    <div className={styles.page}>
      <UniversalHeader role="trainee" />

      <div className={styles.container}>
        <h2 className={styles.title}>פרטי המאמן</h2>
     <div className={styles.trainerInfo}>
        <div className={styles.row}>
          <span>שם המאמן:</span>
          <span>{trainer.name}</span>
        </div>

        <div className={styles.row}>
          <span >אימייל:</span>
          <span>{trainer.email}</span>
        </div>

        <div className={styles.row}>
          <span >מיקום אימון:</span>
          <span>{trainer.address}</span>
        </div>

        <div className={styles.row}>
          <span >סוגי אימון:</span>
          <span>{trainer.types?.join(", ")}</span>
        </div>

        </div>
        {trainings.length === 0 ? <p>אין כרגע אימונים זמינים</p> :
          <table className={styles.table}>
            <thead>
              <tr>
                {days.map((d, dayIndex) => (
                  <th
                    key={d}
                    className={dayIndex === currentDayIndex ? styles.todayHeader : ""}
                  >
                    {d}
                    <br />
                    <span>
                      {getNextDateForDay(dayIndex)}
                    </span>
                  </th>))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {days.map((_, dayIndex) => (
                  <td key={dayIndex}>
                    {trainings
                      .filter((t) => t.day === dayIndex && isTrainingInFuture(t))
                      .map((t, i) => (
                        <div key={i} className={styles.trainingCard}>
                          <p>{t.from} - {t.to}</p>
                          {t.classType === "personal" && t.trainees ?
                            (() => {
                              const myRequest = t.trainees.find((tr: any) => tr.id === trainee?.id);
                              return (
                                <>
                                  <p>אישי- </p>
                                  {myRequest ? <span>{myRequest.status}</span> : <span>תפוס</span>}
                                </>
                              )

                            })()
                            : t.classType === "personal" ?
                              <>
                                <p>אישי</p>
                                <button className={styles.trainingBtn} onClick={() => goToRequestTraining(t)}>
                                  בקשת אימון
                                </button>
                              </>
                              :
                              <>
                                <p>קבוצתי</p>
                                <p>{t.type}</p>
                                <button className={styles.trainingBtn}
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
