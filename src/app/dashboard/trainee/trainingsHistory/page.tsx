"use client";

import UniversalHeader from "@/components/header/header";
import TrainingCard from "@/components/training/TrainingCard";
import AddCommentForm from "@/components/training/AddCommentForm";
import { traineeStore } from "@/store/traineeStore";
import { useEffect, useMemo, useState } from "react";

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
          console.error(err);
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
    <>
      <UniversalHeader role="trainee" />
      <div style={{ padding: "2rem" }}>
        <h2>היסטוריית אימונים</h2>

        {!traineeId && <p>נדרש להתחבר כדי לצפות בהיסטוריה.</p>}
        {traineeId && isLoading && <p>טוען נתונים…</p>}
        {traineeId && error && <p>{error}</p>}

        {traineeId && !isLoading && !error && (
          <>
            {history.length === 0 ? (
              <p>אין אימונים להצגה</p>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                {history.map((training) => (
                  <TrainingCard
                    key={training._id}
                    trainingId={training._id}
                    trainerId={training.trainerId}
                    date={training.date}
                    type={training.type}
                    status={training.status}
                    onAddComment={(trainingId, trainerId) => 
                      setSelectedTraining({ trainingId, trainerId })
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selectedTraining && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            // ✅ סגירת המודאל בלחיצה על הרקע
            onClick={() => setSelectedTraining(null)}
          >
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "12px",
                maxWidth: 500,
                width: "90%",
                position: "relative",
              }}
              // ✅ מונע סגירה בלחיצה על התוכן
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
    </>
  );
}