"use client";

import UniversalHeader from "@/components/header/header";
import { traineeStore } from "@/store/traineeStore";
import { useEffect, useMemo, useState } from "react";
import styles from "./myTrainings.module.css";

interface TrainingSummary {
  _id: string;
  date: string;
  from: string;
  to: string;
  trainerId: string;
  type: string;
  classType: string;
  trainees?: [
    {
      id: string;
      notes?: string;
      status: string;
    }
  ];
}

export default function TrainingsHistoryPage() {
  const user = traineeStore((state) => state.trainee);
  const [notApproved, setNotApproved] = useState<TrainingSummary[]>([]);
  const [futureTrainings, setFutureTrainings] = useState<TrainingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const traineeId = useMemo(() => user?.id ?? "", [user?.id]);

  useEffect(() => {
    if (!traineeId) return;

    async function loadHistory() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/training`, {});
        if (!response.ok) throw new Error("Failed to load training history");

        const data = (await response.json()) as TrainingSummary[];

        const notApproved = data.filter((training) =>
          training.trainees?.some(
            (t) => t.id === traineeId && t.status !== "approved"
          )
        );
        setNotApproved(notApproved);

        const futureTrainings = data.filter(
          (training) =>
            !isTrainingInPast(training) &&
            training.trainees?.some(
              (t) => t.id === traineeId && t.status === "approved"
            )
        );
        setFutureTrainings(futureTrainings);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("אירעה שגיאה בעת טעינת האימונים");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [traineeId]);

  const isTrainingInPast = (training: TrainingSummary) => {
    if (!training?.date || !training?.to) return false;

    const [yearStr, monthStr, dayStr] = training.date.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    const [hourStr, minStr] = training.to.split(":").map(Number);
    const hour = Number(hourStr);
    const minute = Number(minStr);

    const trainingEnd = new Date(year, month - 1, day, hour, minute, 0, 0);
    const now = new Date();

    return trainingEnd < now;
  };

  return (
    <div className={styles.pageWrapper}>

      <UniversalHeader role="trainee" />

      {!traineeId && (
        <p className={styles.stateMsg}>נדרש להתחבר כדי לצפות בהיסטוריה.</p>
      )}
      {traineeId && isLoading && (
        <p className={styles.stateMsg}>טוען נתונים…</p>
      )}
      {traineeId && error && <p className={styles.stateMsg}>{error}</p>}

      {traineeId && !isLoading && !error && (
        <>
          <h3 className={styles.sectionTitle}>אימונים שאושרו:</h3>

          {futureTrainings.length === 0 ? (
            <p className={styles.emptyMsg}>אין אימונים להצגה</p>
          ) : (
            <div className={styles.trainingsList}>
              {futureTrainings.map((training, index) => (
                <div key={index} className={styles.trainingCard}>

                  <p className={styles.row}>
                    <span className={styles.label}>תאריך:</span>
                    <span className={styles.value}>{training.date}</span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>שעה:</span>
                    <span className={styles.value}>
                      {training.from} - {training.to}
                    </span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>מאמן:</span>
                    <span className={styles.value}>{training.trainerId}</span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>סוג אימון:</span>
                    <span className={styles.value}>{training.type}</span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>אופי:</span>
                    <span className={styles.value}>
                      {training.classType === "personal" ? "אישי" : "קבוצתי"}
                    </span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>הערות:</span>
                    <span className={styles.value}>
                      {training.trainees?.find((t) => t.id === traineeId)
                        ?.notes || ""}
                    </span>
                  </p>

      
                </div>
              ))}
            </div>
          )}

          <h3 className={styles.sectionTitle}>אימונים שלא אושרו:</h3>

          {notApproved.length === 0 ? (
            <p className={styles.emptyMsg}>אין אימונים להצגה</p>
          ) : (
            <div className={styles.trainingsList}>
              {notApproved.map((training, index) => (
                <div key={index} className={styles.trainingCard}>

                  <p className={styles.row}>
                    <span className={styles.label}>תאריך:</span>
                    <span className={styles.value}>{training.date}</span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>שעה:</span>
                    <span className={styles.value}>
                      {training.from} - {training.to}
                    </span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>מאמן:</span>
                    <span className={styles.value}>{training.trainerId}</span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>סוג אימון:</span>
                    <span className={styles.value}>{training.type}</span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>סטטוס:</span>
                    <span className={styles.value}>
                      {training.trainees?.find((t) => t.id === traineeId)
                        ?.status === "rejectes"
                        ? "נדחה"
                        : "נשלח"}
                    </span>
                  </p>

                  <p className={styles.row}>
                    <span className={styles.label}>הערות:</span>
                    <span className={styles.value}>
                      {training.trainees?.find((t) => t.id === traineeId)
                        ?.notes || ""}
                    </span>
                  </p>

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
