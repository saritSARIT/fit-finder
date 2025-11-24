"use client";

import { useState } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./personalDetails.module.css";
import { userStore } from "@/store/userStore";

type Training = {
  day: number;
  from: string;
  to: string;
  trainerId: string;
  type: string;
  classType: string; // "personal" | "group"
};

export default function PersonalDetailsPage() {
  const trainer = userStore((state) => state.user);

  // אימונים לפי ימים
  const [trainings, setTrainings] = useState<Training[]>([]);

  // כתובת וסוגי אימון של המאמן
  const [trainerAddress, setTrainerAddress] = useState("");
  const [trainerTypes, setTrainerTypes] = useState<string[]>([]);

  const trainingOptions = ["יוגה", "HIIT", "אירובי", "פילאטיס"];

  // הוספת אימון חדש ליום מסוים
  const addTrainingForDay = (dayIndex: number) => {
    if (!trainer) return;
    setTrainings((prev) => [
      ...prev,
      {
        day: dayIndex,
        from: "",
        to: "",
        trainerId: trainer.id,
        type: "",
        classType: "",
      },
    ]);
  };

  // עדכון שדה של אימון
  const updateTraining = <K extends keyof Training>(
    index: number,
    field: K,
    value: Training[K]
  ) => {
    const updated = [...trainings];
    updated[index][field] = value;
    setTrainings(updated);
  };

  // מחיקת אימון
  const deleteTraining = (index: number) => {
    setTrainings((prev) => prev.filter((_, i) => i !== index));
  };

  // טיפול בבחירת סוג אימון של המאמן
  const toggleTrainerType = (type: string) => {
    if (trainerTypes.includes(type)) {
      setTrainerTypes(trainerTypes.filter((t) => t !== type));
    } else {
      setTrainerTypes([...trainerTypes, type]);
    }
  };

  // שמירה של כל השינויים
  const saveAllChanges = async () => {
    if (!trainer) return;

    try {
      // שמירה ב-Training
      for (const training of trainings) {
        await fetch("/api/training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(training),
        });
      }

      // שמירה בפרטי המאמן ב-Trainer
      /*await fetch(`/api/trainer/${trainer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: trainerAddress,
          types: trainerTypes,
        }),
      });*/

      alert("כל השינויים נשמרו בהצלחה!");
    } catch (err) {
      console.error("Save error:", err);
      alert("שגיאה בשמירת הנתונים");
    }
  };

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  return (
    <div>
      <UniversalHeader role="trainer" />

      <div className={styles.trainerSection}>
        <h3>פרטי המאמן</h3>

        <label>כתובת:</label>
        <input
          type="text"
          value={trainerAddress}
          onChange={(e) => setTrainerAddress(e.target.value)}
        />

        <label>סוגי אימון:</label>
        <div>
          {trainingOptions.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={trainerTypes.includes(type)}
                onChange={() => toggleTrainerType(type)}
              />
              {type}
            </label>
          ))}
        </div>
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
                <button
                  className={styles.pdAddBtnSmall}
                  onClick={() => addTrainingForDay(dayIndex)}
                >
                  + הוספת אימון
                </button>

                {trainings
                  .filter((t) => t.day === dayIndex)
                  .map((t, i) => {
                    const globalIndex = trainings.findIndex((tr) => tr === t);

                    return (
                      <div key={i} className={styles.pdTrainingBox}>
                        <hr />
                        <strong>אימון #{i + 1}</strong>

                        <button
                          type="button"
                          onClick={() => deleteTraining(globalIndex)}
                        >
                          מחק אימון
                        </button>

                        <label>משעה:</label>
                        <input
                          type="time"
                          value={t.from}
                          onChange={(e) =>
                            updateTraining(globalIndex, "from", e.target.value)
                          }
                        />

                        <label>עד שעה:</label>
                        <input
                          type="time"
                          value={t.to}
                          onChange={(e) =>
                            updateTraining(globalIndex, "to", e.target.value)
                          }
                        />

                        <div>
                          <label>
                            <input
                              type="radio"
                              name={`classType-${globalIndex}`}
                              checked={t.classType === "personal"}
                              onChange={() =>
                                updateTraining(globalIndex, "classType", "personal")
                              }
                            />
                            אישי
                          </label>

                          <label>
                            <input
                              type="radio"
                              name={`classType-${globalIndex}`}
                              checked={t.classType === "group"}
                              onChange={() =>
                                updateTraining(globalIndex, "classType", "group")
                              }
                            />
                            קבוצתי
                          </label>
                        </div>

                        {/* סוג אימון רק אם קבוצתי */}
                        {t.classType === "group" && (
                          <>
                            <label>סוג אימון:</label>
                            <input
                              type="text"
                              value={t.type}
                              onChange={(e) =>
                                updateTraining(globalIndex, "type", e.target.value)
                              }
                              placeholder="למשל: יוגה / HIIT / אירובי"
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
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
