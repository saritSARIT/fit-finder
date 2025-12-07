"use client";
import styles from "./myTrainings.module.css";
import { TrainingSummary } from "@/types/trainingSummary";

interface TrainingCardProps {
    training: TrainingSummary;
    handleStatusChange: (trainingId: string, traineeId: string, status: "approved" | "rejected") => void;
    hasTrainingEnded: (training: TrainingSummary) => boolean;
}

export default function TrainingCard({ training, handleStatusChange, hasTrainingEnded }: TrainingCardProps) {
    return (
        <div className={styles.trainingCard}>
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

            <div className={styles.traineesBlock}>
                {training.trainees?.map((t: any, idx: number) => (
                    <div key={idx} className={styles.traineeCard}>
                        <h4 className={styles.traineeName}>{t.name}</h4>

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
    );
}
