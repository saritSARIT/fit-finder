"use client";

import UniversalHeader from "@/components/header/header";
import TrainingCard from "@/components/trainingsHistory/TrainingCard";
import AddCommentForm from "@/components/trainingsHistory/AddCommentForm";
import { traineeStore } from "@/store/traineeStore";
import { useEffect, useMemo, useState } from "react";
import styles from "./trainingsHistory.module.css";

interface TrainingSummary {
  _id: string;
  date?: string;
  type?: string;
  status?: string;
  notes?: string;
  trainerId: string;
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

    const controller = new AbortController();

    async function loadHistory() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({ traineeId, status: "completed" });
        const response = await fetch(`/api/training?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to load training history");

        const data = (await response.json()) as TrainingSummary[];
        setHistory(data ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("אירעה שגיאה בעת טעינת האימונים");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
    return () => controller.abort();
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
