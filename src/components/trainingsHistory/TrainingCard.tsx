"use client";

import styles from "./TrainingCard.module.css";
import { TrainingSummary } from "@/types/trainingSummary";
import { getTrainerById } from "@/services/trainerService";
import { useEffect, useState } from "react";

interface Props {
  training: TrainingSummary;
  onAddComment?: (trainingId: string, trainerId: string) => void;
}

export default function TrainingCard({
  training,
  onAddComment,
}: Props) {

  const [trainer, setTrainer] = useState<string>("");
  useEffect(() => {
    async function fetchTrainer() {
      try {
        const trainerData = await getTrainerById(training.trainerId);
        setTrainer(trainerData.name || "מאמן לא זמין");
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    }
    fetchTrainer();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.date}>{training.date || "תאריך לא זמין"}</div>
      <div>{training.from} - {training.to}</div>
      <div>מאמן: {trainer}</div>
      <div className={styles.detail}>
        סוג אימון: {training.type || "לא זמין"}
      </div>
      {training.classType === "group" ? <div>קבוצתי</div> : <div>אישי</div>}

      <button
        className={styles.addButton}
        onClick={() => onAddComment?.(training._id, training.trainerId)}
      >
        הוסף ביקורת
      </button>
    </div>
  );
}
