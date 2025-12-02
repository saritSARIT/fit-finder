"use client";
import UniversalHeader from "@/components/header/header";
import { getTrainerTrainings, approveOrReject } from "@/services/trainerService";
import { useState, useEffect } from "react";
import { trainerStore } from "@/store/trainerStore";
import styles from "./myTrainings.module.css";

export default function MyTrainingsPage() {
  const trainer = trainerStore((state) => state.trainer);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getTrainerTrainings(trainer?.id || "");
      setTrainings(data);
      setIsLoading(false);
    };
    fetchTrainings();
  }, [trainer?.id]);

  const handleStatusChange = async (
    trainingId: string,
    traineeId: string,
    status: "approved" | "rejected"
  ) => {
    await approveOrReject(trainingId, traineeId, status);
    setTrainings((prev) =>
      prev.map((tr) =>
        tr._id === trainingId
          ? {
              ...tr,
              trainees: tr.trainees.map((t: any) =>
                t.id === traineeId ? { ...t, status } : t
              ),
            }
          : tr
      )
    );
  };

  const hasTrainingEnded = (training: any) => {
    const now = new Date();
    const trainingDate = new Date(training.date);
    const [hours, minutes] = training.to.split(":").map(Number);
    trainingDate.setHours(hours, minutes, 0, 0);
    return trainingDate < now;
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <UniversalHeader role="trainer" />
        <p className={styles.stateMsg}>טוען...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <UniversalHeader role="trainer" />

      {trainings.length === 0 ? (
        <p className={styles.emptyMsg}>אין אימונים זמינים</p>
      ) : (
        <div className={styles.trainingsList}>
          {trainings.map((training: any, index: number) => (
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
                <span className={styles.label}>סוג אימון:</span>
                <span className={styles.value}>{training.type}</span>
              </p>

              <p className={styles.row}>
                <span className={styles.label}>אופי:</span>
                <span className={styles.value}>
                  {training.classType === "personal" ? "אישי" : "קבוצתי"}
                </span>
              </p>

              <div className={styles.traineesBlock}>
                {training.trainees?.map((t: any, idx: number) => (
                  <div key={idx} className={styles.traineeCard}>
                    <h4 className={styles.traineeName}>{t.id}</h4>

                    {hasTrainingEnded(training) ? (
                      <>
                        <p className={styles.statusText}>האימון הסתיים</p>
                        <p className={styles.statusText}>
                          {t.status === "approved"
                            ? "מאושר"
                            : t.status === "rejected"
                            ? "נדחה"
                            : "נשלח"}
                        </p>
                      </>
                    ) : t.status === "sent" ? (
                      <div className={styles.btnRow}>
                        <button
                          className={styles.approveBtn}
                          onClick={() =>
                            handleStatusChange(training._id, t.id, "approved")
                          }
                        >
                          אישור
                        </button>
                        <button
                          className={styles.rejectBtn}
                          onClick={() =>
                            handleStatusChange(training._id, t.id, "rejected")
                          }
                        >
                          דחיה
                        </button>
                      </div>
                    ) : (
                      <p className={styles.statusText}>
                        {t.status === "approved"
                          ? "מאושר"
                          : t.status === "rejected"
                          ? "נדחה"
                          : `לא זמין: ${t.status}`}
                      </p>
                    )}

                    {t.notes?.map((note: any, nIdx: number) => (
                      <p key={nIdx} className={styles.noteText}>
                        {note}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

        
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
