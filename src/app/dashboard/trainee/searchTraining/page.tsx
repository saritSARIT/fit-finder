"use client";
import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import "./style.css";

export default function SearchTrainingPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => console.error("שגיאה בטעינת מאמנים:", err));
  }, []);

  const filtered = selectedTrainer
    ? trainers.filter((t) => t.name?.includes(selectedTrainer))
    : trainers;

  return (
    <div className="search-page">
      {/* תפריט עליון */}
      <header className="top-bar">
        {/* לוגו */}
        <div className="logo-container">
          <img
            src="/images/logo.png"
            alt="FitFinder Logo"
            className="logo-img"
          />
          <span className="logo-text">FitFinder</span>
        </div>

        {/* ניווט */}
        <nav className="nav-links">
          <a href="#" className="active">חיפוש אימון</a>
          <span>|</span>
          <a href="#">האימונים שלי</a>
          <span>|</span>
          <a href="#">היסטוריית אימונים</a>
          <span>|</span>
          <a href="#">רשימת מועדפים</a>
        </nav>

        {/* כפתור פרופיל */}
        <button className="profile-btn">מעבר לפרופיל מאמן</button>
      </header>

      {/* אזור חיפוש */}
      <div className="search-container">
        {/* dropdown חיפוש מאמן */}
        <div className="trainer-dropdown">
          <button
            className="dropdown-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedTrainer || "חיפוש שם מאמן"} ▼
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {trainers.map((t) => (
                <div
                  key={t._id}
                  className="dropdown-item"
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
          className="filter-button"
          onClick={() => setIsFilterOpen(true)}
          title="פתח סינון"
        >
          <FaFilter size={22} />
        </button>
      </div>

      {/* רשימת מאמנים */}
      <div className="trainers-grid">
        {filtered.map((t) => (
          <div key={t._id} className="trainer-card">
            <p>מאמנים של אותו יום מהשעה {t.time || "—"}</p>
            <p>שהוא נכנס ואילך</p>
            <p className="trainer-name">מאמן: {t.name}</p>
            <p className="trainer-location">מיקום: {t.location || "—"}</p>
          </div>
        ))}
      </div>

      {/* חלון סינון שנפתח מצד ימין */}
      {isFilterOpen && (
        <div className="filter-popup">
          <div className="filter-header">
            <h3>סינון</h3>
            <button
              className="close-filter"
              onClick={() => setIsFilterOpen(false)}
            >
              ✖
            </button>
          </div>

          <div className="filter-body">
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

            <button className="apply-filter">החל סינון</button>
          </div>
        </div>
      )}
    </div>
  );
}
