"use client";

import UniversalHeader from "@/components/header/header";
import { traineeStore } from "@/store/traineeStore";
import { useEffect, useMemo, useState } from "react";
import styles from "./myTrainings.module.css";
import { getTrainerById } from "@/services/trainerService";
import { TrainingSummary } from "@/types/trainingSummary";
import { isTrainingInPast } from "@/lib/functions/trainingsDates";
import Loader from "@/components/loader/Loader";

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

        const data: TrainingSummary[] = await response.json();

        const dataWithTrainerNames = await Promise.all(
          data.map(async (training) => {
            const trainer = await getTrainerById(training.trainerId);
            return { ...training, trainerName: trainer.name };
          })
        );

        const notApproved = dataWithTrainerNames.filter((training) =>
          training.trainees?.some(
            (t) => t.id === traineeId && t.status !== "approved"
          )
        );
        setNotApproved(notApproved);

        const futureTrainings = dataWithTrainerNames.filter(
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


  return (
    <div className={styles.pageWrapper}>

      <UniversalHeader role="trainee" />

      {!traineeId && (
        <p className={styles.stateMsg}>נדרש להתחבר כדי לצפות באימונים</p>
      )}
      {traineeId && isLoading && <Loader />}
      {traineeId && error && <Loader />}

      {traineeId && !isLoading && !error && (
        <>
          <h3 className={styles.sectionTitle}>אימונים שאושרו:</h3>

          {futureTrainings.length === 0 ? (
            <p className={styles.emptyMsg}>אין כרגע אימונים זמינים</p>
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
                    <span className={styles.value}>{training.trainerName}</span>
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
            <p className={styles.emptyMsg}>אין כרגע אימונים להצגה </p>
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
                    <span className={styles.value}>{training.trainerName}</span>
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

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
