"use client";

import React, { useState } from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./personalDetails.module.css";

// אם רוצים שילוב עם Google Places:
// תצטרכי להוסיף את ספריית google-maps-react או @react-google-maps/api
// כאן אני נותנת דוגמה בסיסית של autocomplete שמאפשר חיפוש כתובת
// (את ממש תצטרכי להוסיף את API KEY שלך ולהתקין חבילה מתאימה)

type Training = {
  day: number;
  from: string;
  to: string;
  types: string[];      // סוגי אימון (רשימה)
  address: string;
  personal: boolean;
  group: boolean;
  date: string;
};

export default function PersonalDetailsPage() {
  const [trainings, setTrainings] = useState<Training[]>([
    {
      day: 0,
      from: "",
      to: "",
      types: [""],
      address: "",
      personal: false,
      group: false,
      date: "",
    },
  ]);

  const addTraining = () => {
    setTrainings([
      ...trainings,
      {
        day: 0,
        from: "",
        to: "",
        types: [""],
        address: "",
        personal: false,
        group: false,
        date: "",
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

  const updateTrainingType = (index: number, typeIndex: number, value: string) => {
    const updated = [...trainings];
    updated[index].types[typeIndex] = value;
    setTrainings(updated);
  };

  const addTrainingType = (index: number) => {
    const updated = [...trainings];
    updated[index].types.push("");
    setTrainings(updated);
  };

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  return (
    <div className={styles.pdContainer}>
      <UniversalHeader role="trainer" />

      <div className={styles.pdFilters}>
        <div className={styles.pdFilterBox}>סוג אימון:</div>
        <div className={styles.pdFilterBox}>מקום אימון:</div>
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
                  .filter((t) => Number(t.day) === dayIndex)
                  .map((t, i) => (
                    <div key={i} className={styles.pdTrainingBox}>
                      <strong>{i + 1}</strong>

                      {/* כתובת עם אפשרות חיפוש */}
                      <label>כתובת:</label>
                      <input
                        type="text"
                        value={t.address}
                        placeholder="הזן כתובת"
                        onChange={(e) =>
                          updateTraining(i, "address", e.target.value)
                        }
                      // בעתיד אפשר להוסיף כאן autocomplete של Google
                      />

                      {/* משעה */}
                      <label>משעה:</label>
                      <input
                        type="time"
                        value={t.from}
                        onChange={(e) =>
                          updateTraining(i, "from", e.target.value)
                        }
                      />

                      {/* עד שעה */}
                      <label>עד שעה:</label>
                      <input
                        type="time"
                        value={t.to}
                        onChange={(e) =>
                          updateTraining(i, "to", e.target.value)
                        }
                      />

                      {/* תאריך */}
                      <label>תאריך:</label>
                      <input
                        type="date"
                        value={t.date}
                        onChange={(e) =>
                          updateTraining(i, "date", e.target.value)
                        }
                      />

                      {/* סוגי אימון */}
                      <label>סוגי אימון:</label>
                      {t.types.map((type, typeIndex) => (
                        <div key={typeIndex} style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                          <input
                            type="text"
                            placeholder="הזן סוג אימון"
                            value={type}
                            onChange={(e) =>
                              updateTrainingType(i, typeIndex, e.target.value)
                            }
                          />
                        </div>
                      ))}
                      <button type="button" onClick={() => addTrainingType(i)}>
                        הוספת סוג אימון
                      </button>

                      {/* סוג אימון: אישי / קבוצתי */}
                      <div style={{ marginTop: "10px" }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={t.personal}
                            onChange={(e) =>
                              updateTraining(i, "personal", e.target.checked)
                            }
                          />
                          אישי
                        </label>

                        <label style={{ marginLeft: "10px" }}>
                          <input
                            type="checkbox"
                            checked={t.group}
                            onChange={(e) =>
                              updateTraining(i, "group", e.target.checked)
                            }
                          />
                          קבוצתי
                        </label>
                      </div>
                    </div>
                  ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <button className={styles.pdAddBtn} onClick={addTraining}>
        הוספת אימון
      </button>

      <div className={styles.pdSaveWrapper}>
        <button className={styles.pdSaveBtn}>שמירת שינויים</button>
      </div>
    </div>
  );
}
