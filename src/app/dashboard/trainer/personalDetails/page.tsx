"use client";

import { useState } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./personalDetails.module.css";
import { trainerStore } from "@/store/trainerStore";
import { useEffect } from "react";
import { getTrainerTrainings } from "@/services/trainerService"

type Training = {
  day: number;
  from: string;
  to: string;
  trainerId: string;
  type: string;
  classType: string; // "personal" | "group"
  date: string,
};

export default function PersonalDetailsPage() {
  const trainer = trainerStore((state) => state.trainer);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainerAddress, setTrainerAddress] = useState("");
  const [trainerTypes, setTrainerTypes] = useState<string[]>([]);
  const [showTypes, setShowTypes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trainer) return;

    const fetchTrainerData = async () => {
      try {
        const res = await fetch(`/api/trainer/${trainer.id}`);
        if (!res.ok) throw new Error("Failed to fetch trainer data");
        const data = await res.json();

        // הגדרת הנתונים ב-state
        setTrainerAddress(data.address || "");
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

  const trainingOptions = ["יוגה", "HIIT", "אירובי", "פילאטיס", "קרוספיט", "אימון כוח", "אימון משקל גוף", "שחייה", "ריצה", "טבטה", "קיקבוקס", "איגרוף", " TRX", "מתיחות", "פילאטיס מכשירים", "Core", "אליפטיקל", "קפיצות בחבל", "אימון פונקציונלי", "זומבה"];

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

  const updateTraining = <K extends keyof Training>(
    index: number,
    field: K,
    value: Training[K]
  ) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  const deleteTraining = (index: number) => {
    setTrainings((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTrainerType = (type: string) => {
    if (trainerTypes.includes(type)) {
      setTrainerTypes(trainerTypes.filter((t) => t !== type));
    } else {
      setTrainerTypes([...trainerTypes, type]);
    }
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
            alert("שגיאה");
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
            alert("שגיאה");
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
            alert("שגיאה");
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
        alert("הפרטים עודכנו בהצלחה");
      }
      else {
        alert("שגיאה");
      }

    } catch (err) {
      console.error("Save error:", err);
      alert("שגיאה בשמירת הנתונים");
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

  return (
    <div className={styles.container}>
      <UniversalHeader role="trainer" />

      <div className={styles.trainerWrapper}>

        <label>כתובת:</label>
        <input
          type="text"
          className={styles.inputCommon}
          value={trainerAddress}
          onChange={(e) => setTrainerAddress(e.target.value)}
        />
        <br />

        <label>סוגי אימון:</label>

        <button
          type="button"
          className={styles.typesBtn}
          onClick={() => setShowTypes(!showTypes)}
        >
          בחר סוגי אימון
        </button>

        {showTypes && (
          <div className={styles.typesDropdown}>
            {trainingOptions.map((option) => (
              <label key={option} className={styles.typeCheckbox}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={trainerTypes.includes(option)}
                  onChange={() => toggleTrainerType(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <table className={styles.pdTable}>
        <thead>
          <tr>
            {days.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {days.map((_, dayIndex) => (
              <td key={dayIndex} className={styles.pdCell}>

                {trainings
                  .filter((t) => t.day === dayIndex)
                  .map((t, i) => {
                    const index = trainings.findIndex((tr) => tr === t);

                    return (
                      <div key={i} className={styles.pdTrainingBox}>
                        <hr />
                        <strong>אימון {i + 1}</strong>
                        <br />

                        <small>{t.date}</small>
                        <br />

                        <label>משעה:</label>
                        <input
                          type="time"
                          value={t.from}
                          onChange={(e) =>
                            updateTraining(index, "from", e.target.value)
                          }
                        />
                        <br />
                        <label>עד שעה:</label>
                        <input
                          type="time"
                          value={t.to}
                          onChange={(e) =>
                            updateTraining(index, "to", e.target.value)
                          }
                        />
                        <br />

                        <div>
                          <label>
                            <input
                              type="radio"
                              name={`classType-${index}`}
                              checked={t.classType === "personal"}
                              onChange={() => {
                                updateTraining(index, "classType", "personal");
                                updateTraining(index, "type", "");
                              }
                              }
                            />
                            אישי
                          </label>

                          <label>
                            <input
                              type="radio"
                              name={`classType-${index}`}
                              checked={t.classType === "group"}
                              onChange={() =>
                                updateTraining(index, "classType", "group")
                              }
                            />
                            קבוצתי
                          </label>
                        </div>
                        {t.classType === "group" && (
                          <>
                            <label>סוג אימון:</label>
                            <select
                              value={t.type}
                              onChange={(e) =>
                                updateTraining(index, "type", e.target.value)
                              }
                            >
                              {trainerTypes.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                        <br />

                        <button className={styles.deleteBtn}
                          type="button"
                          onClick={() => deleteTraining(index)}
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
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

      <div className={styles.pdSaveWrapper}>
        <button className={styles.pdSaveBtn} onClick={saveAllChanges}>
          שמירת שינויים
        </button>
      </div>
    </div>
  );
}
