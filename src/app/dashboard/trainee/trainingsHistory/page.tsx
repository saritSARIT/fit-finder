"use client";

import UniversalHeader from "@/components/header/header";
// import { userStore } from "@/store/userStore";
import { traineeStore } from "@/store/traineeStore";
import { trainerStore } from "@/store/trainerStore";
import { useEffect, useMemo, useState } from "react";

interface TrainingSummary {
  _id: string;
  date?: string;
  type?: string;
  status?: string;
  notes?: string;
}

export default function TrainingsHistoryPage() {
  const user = traineeStore((state) => state.trainee);
  const [history, setHistory] = useState<TrainingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traineeId = useMemo(() => user?.id ?? "", [user?.id]);

  useEffect(() => {
    if (!traineeId) {
      return;
    }

    const controller = new AbortController();
    async function loadHistory() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          traineeId,
          status: "completed",
        });
        const response = await fetch(`/api/training?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load training history");
        }

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
      <div>
        <h2>היסטוריית אימונים</h2>

        {!traineeId && <p>נדרש להתחבר כדי לצפות בהיסטוריה.</p>}
        {traineeId && isLoading && <p>טוען נתונים…</p>}
        {traineeId && error && <p>{error}</p>}

        {traineeId && !isLoading && !error && (
          <>
            {history.length === 0 ? (
              <p>אין אימונים להצגה</p>
            ) : (
              <ul>
                {history.map((training) => (
                  <li key={training._id}>
                    <strong>{training.date || "תאריך לא זמין"}</strong> —{" "}
                    {training.type || "סוג לא זמין"}{" "}
                    {training.status && `(${training.status})`}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}