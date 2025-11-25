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

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainerAddress, setTrainerAddress] = useState("");
  const [trainerTypes, setTrainerTypes] = useState<string[]>([]);
  const [showTypes, setShowTypes] = useState(false);

  const trainingOptions = ["יוגה", "HIIT", "אירובי", "פילאטיס"];

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
      for (const training of trainings) {
        await fetch("/api/training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(training),
        });
      }

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

      <div className={styles.trainerWrapper}>
        <h3 className={styles.trainerHeader}>פרטי המאמן</h3>

        <label>כתובת:</label>
        <input
          type="text"
          className={styles.inputCommon}
          value={trainerAddress}
          onChange={(e) => setTrainerAddress(e.target.value)}
        />

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

                        {t.classType === "group" && (
                          <>
                            <label>סוג אימון:</label>
                            <select
                              value={t.type}
                              onChange={(e) =>
                                updateTraining(globalIndex, "type", e.target.value)
                              }
                            >
                              {trainingOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
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
