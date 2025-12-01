"use client";

import UniversalHeader from "@/components/header/header";
import TrainingCard from "@/components/trainingsHistory/TrainingCard";
import AddCommentForm from "@/components/trainingsHistory/AddCommentForm";
import { traineeStore } from "@/store/traineeStore";
import { useEffect, useMemo, useState } from "react";
import styles from "./trainingsHistory.module.css";

interface TrainingSummary {
  _id: string;
  date: string;
  from: string;
  to: string;
  trainerId: string;
  type: string;
  classType: string;
  trainees?: [{
    id: string;
    notes?: string;
    status: string;
  }];
}

export default function TrainingsHistoryPage() {
  const user = traineeStore((state) => state.trainee);
  const [history, setHistory] = useState<TrainingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTraining, setSelectedTraining] = useState<{
    trainingId: string;
    trainerId: string;
  } | null>(null);

  const traineeId = useMemo(() => user?.id ?? "", [user?.id]);

  useEffect(() => {
    if (!traineeId) return;

    const isTrainingInPast = (training: TrainingSummary) => {
      if (!training?.date || !training?.to) return false;

      // parse date YYYY-MM-DD
      const [yearStr, monthStr, dayStr] = training.date.split("-");
      const year = Number(yearStr);
      const month = Number(monthStr); // 1..12
      const day = Number(dayStr);

      // parse 'to' time HH:MM
      const [hourStr, minStr] = training.to.split(":").map(Number);
      const hour = Number(hourStr);
      const minute = Number(minStr);

      const trainingEnd = new Date(year, month - 1, day, hour, minute, 0, 0);
      const now = new Date();

      return trainingEnd < now; 
    };



    async function loadHistory() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/training`, {
        });

        if (!response.ok) throw new Error("Failed to load training history");

        const data = (await response.json()) as TrainingSummary[];
        const filteredData = data.filter(training =>
          training.trainees?.some(
            t => t.id === traineeId
              && t.status === "approved"
          )
        ).filter(isTrainingInPast);

        setHistory(filteredData);
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
    <div className={styles.container}>

      <UniversalHeader role="trainee" />

      {!traineeId && <p className={styles.text}>נדרש להתחבר כדי לצפות בהיסטוריה.</p>}
      {traineeId && isLoading && <p className={styles.text}>טוען נתונים…</p>}
      {traineeId && error && <p className={styles.text}>{error}</p>}

      {traineeId && !isLoading && !error && (
        <>
          {history.length === 0 ? (
            <p className={styles.text}>אין אימונים להצגה</p>
          ) : (
            <div className={styles.list}>
              {history.map((training) => (
                <TrainingCard
                  key={training._id}
                  trainingId={training._id}
                  trainerId={training.trainerId}
                  date={training.date}
                  type={training.type}
                  onAddComment={(trainingId, trainerId) =>
                    setSelectedTraining({ trainingId, trainerId })
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedTraining && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedTraining(null)}
        >
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
          >
            <AddCommentForm
              trainingId={selectedTraining.trainingId}
              trainerId={selectedTraining.trainerId}
              onClose={() => setSelectedTraining(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
