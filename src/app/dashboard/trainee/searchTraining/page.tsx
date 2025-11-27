"use client";

import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { UniversalHeader } from "@/components/index";
import { useRouter } from "next/navigation";
import styles from "./searchTraining.module.css";

export default function SearchTrainingPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trainer")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => console.error("שגיאה בטעינת מאמנים:", err));
  }, []);

  const filtered = selectedTrainer
    ? trainers.filter((t) => t.name?.includes(selectedTrainer))
    : trainers;

  const goToTrainerSession = (trainer: any) => {
    localStorage.setItem("selectedTrainer", JSON.stringify(trainer));
    router.push("searchTraining/trainer-session");
  };

  return (
    <div className={styles["search-page"]}>
      <UniversalHeader role="trainee" />

      {/* אזור חיפוש */}
      <div className={styles["search-container"]}>
        {/* dropdown */}
        <div className={styles["trainer-dropdown"]}>
          <button
            className={styles["dropdown-btn"]}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedTrainer || "חיפוש שם מאמן"} ▼
          </button>
          {isDropdownOpen && (
            <div className={styles["dropdown-menu"]}>
              {trainers.map((t) => (
                <div
                  key={t._id}
                  className={styles["dropdown-item"]}
                  onClick={() => {
                    setSelectedTrainer(t.name);
                    setIsDropdownOpen(false);
                  }}
                >
                  {t.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* אייקון סינון */}
        <button
          className={styles["filter-button"]}
          onClick={() => setIsFilterOpen(true)}
          title="פתח סינון"
        >
          <FaFilter size={22} />
        </button>
      </div>

      {/* רשימת מאמנים */}
      <div className={styles["trainers-grid"]}>
        {filtered.map((t) => (
          <div
            key={t._id}
            className={styles["trainer-card"]}
            onClick={() => goToTrainerSession(t)}
          >
            <p>מאמנים של אותו יום מהשעה {t.time || "—"}</p>
            <p>שהוא נכנס ואילך</p>
            <p>מאמן: {t.name}</p>
            <p>מיקום: {t.address || "—"}</p>
          </div>
        ))}
      </div>

      {/* חלון סינון */}
      {isFilterOpen && (
        <div className={styles["filter-popup"]}>
          <div className={styles["filter-header"]}>
            <h3>סינון</h3>
            <button
              className={styles["close-filter"]}
              onClick={() => setIsFilterOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className={styles["filter-body"]}>
            <label>
              סוג אימון:
              <select>
                <option>כושר</option>
                <option>יוגה</option>
                <option>תזונה</option>
              </select>
            </label>

            <label>
              מיקום:
              <input type="text" placeholder="הכנס מיקום..." />
            </label>

            <button className={styles["apply-filter"]}>החל סינון</button>
          </div>
        </div>
      )}
    </div>
  );
}
