"use client";
import UniversalHeader from "@/components/header/header";
import { getTrainerTrainings, approveOrReject } from "@/services/trainerService";
import { useState, useEffect } from "react";
import { trainerStore } from "@/store/trainerStore";

export default function MyTrainingsPage() {
  const trainer = trainerStore((state) => state.trainer);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getTrainerTrainings(trainer?.id || '');
      setTrainings(data);
      setIsLoading(false);
    };
    fetchTrainings();
  }, [trainer?.id]);

  const handleStatusChange = async (trainingId: string, traineeId: string, status: "approved" | "rejected") => {
    await approveOrReject(trainingId, traineeId, status);
    setTrainings(prev =>
      prev.map(tr =>
        tr._id === trainingId
          ? { ...tr, trainees: tr.trainees.map((t: any) => t.id === traineeId ? { ...t, status } : t) }
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
      <div>
        <UniversalHeader role="trainer" />
        <p>טוען...</p>
      </div>
    )
  }

  return (
    <div>
      <UniversalHeader role="trainer" />
      {trainings.length === 0 ? (
        <p>אין אימונים זמינים</p>
      ) : (
        trainings.map((training: any, index: number) => (
          <div key={index}>
            <p>{training.date}</p>
            <p>{training.from} - {training.to}</p>
            <p>{training?.type}</p>
            {training.classType === "personal" ? <p>אישי</p> : <p>קבוצתי</p>}
            {training.trainees?.map((t: any, index: number) => (
              <div key={index}>
                <h3>{t.id}</h3>
                {hasTrainingEnded(training) ? (<p>האימון הסתיים
                  {t.status === "approved" ? <p>מאושר</p> : t.status === "rejected" ? <p>נדחה</p> : <p>נשלח</p>}
                </p>) :
                  t.status === "sent" ?
                    <>
                      <button onClick={() => handleStatusChange(training._id, t.id, "approved")}>אישור</button>
                      <button onClick={() => handleStatusChange(training._id, t.id, "rejected")}>דחיה</button>
                    </>
                    : t.status === "approved" ?
                      <p>מאושר</p>
                      : t.status === "rejected" ?
                        <p>נדחה</p>
                        :
                        <p>לא זמין: {t.status}</p>
                }
                {t.notes?.map((note: any, index: number) => (
                  <p key={index}>{note}</p>
                ))}
              </div>
            ))}
            <hr></hr>
          </div>
        ))
      )}
    </div>
  );
}