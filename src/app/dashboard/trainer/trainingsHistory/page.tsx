"use client";
import UniversalHeader from "@/components/header/header";
import { getTrainerTrainings, approveOrReject } from "@/services/trainerService";
import { useState, useEffect } from "react";
import { trainerStore } from "@/store/trainerStore";
import { getTraineeById } from "@/services/traineeService";
import styles from "./myTrainings.module.css";
import { TrainingSummary } from "@/types/trainingSummary";
import { isTrainingInPast } from "@/lib/functions/trainingsDates";
import TrainingCard from "@/components/trainer/trainingCard";

export default function MyTrainingsPage() {
  const trainer = trainerStore((state) => state.trainer);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      const response = await getTrainerTrainings(trainer?.id || "");

      const data: TrainingSummary[] = await response;

      const dataWithTraineesNames = await Promise.all(
        data.map(async (training) => {
          const traineesWithNames = await Promise.all(
            (training.trainees ?? []).map(async (t) => {
              const trainee = await getTraineeById(t.id);
              return { ...t, name: trainee.name };
            })
          );
          return { ...training, trainees: traineesWithNames };
        })
      );

      const trainings = dataWithTraineesNames.filter(
        (training) => isTrainingInPast(training)
      );

      setTrainings(trainings);
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

  const personal = trainings.filter(t => t.classType === "personal");
  const group = trainings.filter(t => t.classType === "group");

  return (
    <div className={styles.pageWrapper}>
      <UniversalHeader role="trainer" />

      {trainings.length === 0 ? (
        <p className={styles.emptyMsg}>אין כרגע אימונים זמינים</p>
      ) : (
        <>
          <h2>אישי</h2>
          <div className={styles.trainingsList}>
            {personal.length > 0 ?
              personal.map((training: any, index: number) => (
                <TrainingCard
                  key={index}
                  training={training}
                  handleStatusChange={handleStatusChange}
                  hasTrainingEnded={hasTrainingEnded}
                />
              ))
              :
              <p>אין כרגע אימונים אישיים זמינים</p>
            }
          </div>
          <h2>קבוצתי</h2>
          <div className={styles.trainingsList}>
            {group.length > 0 ?
              group.map((training: any, index: number) => (
                <TrainingCard
                  key={index}
                  training={training}
                  handleStatusChange={handleStatusChange}
                  hasTrainingEnded={hasTrainingEnded}
                />
              ))
              :
              <p>אין כרגע אימונים קבוצתיים זמינים</p>
            }
          </div>
        </>
      )}
    </div>
  );
}
