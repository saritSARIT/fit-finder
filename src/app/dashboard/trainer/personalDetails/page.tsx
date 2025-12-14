"use client";

import { useState, useEffect } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./personalDetails.module.css";
import { trainerStore } from "@/store/trainerStore";
import { getTrainerTrainings } from "@/services/trainerService"
import { Training } from "@/types/training"
import TrainingCard from "@/components/personalDetails/trainingCard";
import TypesCard from "@/components/personalDetails/types";
import AddressCard from "@/components/personalDetails/address";
import { isTrainingInFuture } from "@/lib/functions/trainingsDates"
import { showToast } from "@/components/toast/Toast";
import { getNextDateForDay } from "@/lib/functions/trainingsDates";


export default function PersonalDetailsPage() {
  const trainer = trainerStore((state) => state.trainer);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainerAddress, setTrainerAddress] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [trainerTypes, setTrainerTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainer) return;

    const fetchTrainerData = async () => {
      try {
        const res = await fetch(`/api/trainer/${trainer.id}`);

        if (!res.ok) throw new Error("Failed to fetch trainer data");
        const data = await res.json();

        // הגדרת הנתונים ב-state
        const initialAddress = data.address || "";
        setTrainerAddress(initialAddress);
        setAddressQuery(initialAddress);
        setTrainerTypes(data.types || []);

        // אם יש לך אימונים שמורים
        const existing = await getTrainerTrainings(trainer.id);

        setTrainings(existing);
      } catch (err) {
        console.error("Error fetching trainer data:", err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [trainer]);

  const addTrainingForDay = (dayIndex: number) => {
    if (!trainer) return;

    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sunday, 6 = Saturday
    let diff = dayIndex - currentDayIndex;
    if (diff < 0) diff += 7; // אם היום כבר עבר השבוע, נלך לשבוע הבא

    const trainingDate = new Date(today);
    trainingDate.setDate(today.getDate() + diff);

    setTrainings((prev) => [
      ...prev,
      {
        day: dayIndex,
        from: "",
        to: "",
        trainerId: trainer.id,
        type: trainerTypes[0],
        classType: "",
        date: trainingDate.toISOString().split("T")[0], // YYYY-MM-DD
      },
    ]);
  };

  const saveAllChanges = async () => {
    if (!trainer) return;

    try {
      const existingTrainings = await getTrainerTrainings(trainer.id);

      for (const t of trainings) {
        // לבדוק אם האימון כבר קיים במונגו
        const exists = existingTrainings.find((et: any) =>
          et.day === t.day &&
          et.from === t.from &&
          et.to === t.to &&
          et.classType === t.classType &&
          et.type === t.type &&
          et.date === t.date
        );

        if (exists) {
          // עדכון האימון הקיים לפי מה ששונה
          const res = await fetch(`/api/training/${exists._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(t),
          });
          if (res.status !== 200 && res.status !== 201) {
            showToast("שגיאה");
            return;
          }
        } else {
          // הוספת אימון חדש
          const res = await fetch("/api/training", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(t),
          });
          if (res.status !== 200 && res.status !== 201) {
            showToast("שגיאה");
            return;
          }
        }
      }

      // מחיקת אימונים שנמחקו מה-state אבל קיימים במונגו
      for (const et of existingTrainings) {
        const stillExists = trainings.find(t =>
          t.day === et.day &&
          t.from === et.from &&
          t.to === et.to &&
          t.classType === et.classType &&
          t.type === et.type &&
          t.date === et.date
        );
        if (!stillExists) {
          const res = await fetch(`/api/training/${et._id}`, { method: "DELETE" });
          if (res.status !== 200 && res.status !== 201) {
            showToast("שגיאה");
            return;
          }
        }
      }

      // שמירה בפרטי המאמן ב-Trainer
      const res = await fetch(`/api/trainer/${trainer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: trainerAddress,
          types: trainerTypes,
        }),
      });

      if (res.status === 200 || res.status === 201) {
        showToast("הפרטים עודכנו בהצלחה");
      }
      else {
        showToast("שגיאה");
      }

    } catch (err) {
      console.error("Save error:", err);
      showToast("שגיאה בשמירת הנתונים");
    }
  };

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  if (loading) {
    return (
      <div className={styles.container}>
        <UniversalHeader role="trainer" />
        <h2>טוען...</h2>
      </div>
    );
  }

  const currentDayIndex = new Date().getDay();

  return (
    <div className={styles.container}>
      <UniversalHeader role="trainer" />
      <div className={styles.trainerWrapper}>
      <AddressCard
        addressQuery={addressQuery}
        setAddressQuery={setAddressQuery}
        trainerAddress={trainerAddress}
        setTrainerAddress={setTrainerAddress}
      />
      <br />
      <TypesCard
        trainerTypes={trainerTypes}
        setTrainerTypes={setTrainerTypes}
      />

      <table className={styles.pdTable}>
        <thead>
          <tr>
            {days.map((d, dayIndex) => (
              <th
                key={d}
                className={dayIndex === currentDayIndex ? styles.todayHeader : ""}
              >
                {d}
                <br />
                <span>
                  {getNextDateForDay(dayIndex)}
                </span>
              </th>))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {days.map((_, dayIndex) => (
              <td key={dayIndex} className={styles.pdCell}>

                {trainings
                  .filter((t) => {
                    if (!t.from) return t.day === dayIndex; // עדיין לא מולא - תציג
                    return t.day === dayIndex && isTrainingInFuture(t);
                  })
                  .map((t, i) => {
                    const index = trainings.findIndex((tr) => tr === t);

                    return (
                      <TrainingCard
                        key={i}
                        t={t}
                        i={i}
                        index={index}
                        trainerTypes={trainerTypes}
                        trainings={trainings}
                        setTrainings={setTrainings}
                      />
                    );
                  })
                }
                <button
                  className={styles.pdAddBtnSmall}
                  onClick={() => addTrainingForDay(dayIndex)}
                >
                  +
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
</div>
      <div className={styles.pdSaveWrapper}>
        <button className={styles.pdSaveBtn} onClick={saveAllChanges}>
          שמירת שינויים
        </button>
      </div>
    </div>
  );
}
