"use client";

import styles from "./TrainingCard.module.css";

interface Props {
  trainingId: string;
  trainerId: string;
  date?: string;
  type?: string;
  onAddComment?: (trainingId: string, trainerId: string) => void;
}

export default function TrainingCard({
  trainingId,
  trainerId,
  date,
  type,
  onAddComment,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.date}>{date || "תאריך לא זמין"}</div>

      <div className={styles.detail}>
        סוג אימון: {type || "לא זמין"}
      </div>

      <button
        className={styles.addButton}
        onClick={() => onAddComment?.(trainingId, trainerId)}
      >
        הוסף ביקורת
      </button>
    </div>
  );
}
