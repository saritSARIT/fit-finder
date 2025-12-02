//מציג את האימונים העתידיים ושלא אושרו

"use client";

import UniversalHeader from "@/components/header/header";
import { traineeStore } from "@/store/traineeStore";
import { useEffect, useMemo, useState } from "react";

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

        const response = await fetch(`/api/training`, {
        });

        if (!response.ok) throw new Error("Failed to load training history");

        const data = (await response.json()) as TrainingSummary[];
        const notApproved = data.filter(training =>
          training.trainees?.some(
            t => t.id === traineeId
              && t.status !== "approved"
          )
        );
        setNotApproved(notApproved);// לא אושרו

        const futureTrainings = data.filter(training =>
          !isTrainingInPast(training) &&
          training.trainees?.some(
            t => t.id === traineeId
              && t.status === "approved"
          )
        );
        setFutureTrainings(futureTrainings);// עתידיים שאושרו
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

  return (
    <div>

      <UniversalHeader role="trainee" />

      {!traineeId && <p>נדרש להתחבר כדי לצפות בהיסטוריה.</p>}
      {traineeId && isLoading && <p>טוען נתונים…</p>}
      {traineeId && error && <p>{error}</p>}

      {traineeId && !isLoading && !error && (
        <>
          אימונים שאושרו:
          {futureTrainings.length === 0 ? (
            <p>אין אימונים להצגה</p>
          ) : (
            <div>
              {futureTrainings.map((training, index) => (
                <div key={index}>
                  <p>{training.date}</p>
                  <p>{training.from} - {training.to}</p>
                  <p>{training.trainerId}</p>
                  <p>{training.type}</p>
                  {training.classType === "personal" ? <p>אישי</p> : <p>קבוצתי</p>}
                  <p>{training.trainees?.find(t => t.id === traineeId)?.notes || ""}</p>
                  <hr></hr>
                </div>
              ))}
            </div>
          )}
          אימונים שלא אושרו:
          {notApproved.length === 0 ? (
            <p>אין אימונים להצגה</p>
          ) : (
            <div>
              {notApproved.map((training, index) => (
                <div key={index}>
                  <p>{training.date}</p>
                  <p>{training.from} - {training.to}</p>
                  <p>{training.trainerId}</p>
                  <p>{training.type}</p>
                  {training.classType === "personal" ? <p>אישי</p> : <p>קבוצתי</p>}
                  {training.trainees?.find(t => t.id === traineeId)?.status === "rejectes" ? <p>נדחה</p> : <p>נשלח</p>}
                  <p>{training.trainees?.find(t => t.id === traineeId)?.notes || ""}</p>
                  <hr></hr>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
