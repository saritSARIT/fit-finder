"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FaFilter } from "react-icons/fa";
import { UniversalHeader } from "@/components/index";
import { useRouter } from "next/navigation";
import styles from "./searchTraining.module.css";
import FilterPanel, {
  TrainingFilters,
  defaultTrainingFilters,
} from "@/components/filter/filter";
import { traineeStore } from "@/store/traineeStore";

export default function SearchTrainingPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<TrainingFilters>(defaultTrainingFilters);
  const [appliedFilters, setAppliedFilters] = useState<TrainingFilters>(defaultTrainingFilters);
  const [isLoading, setIsLoading] = useState(true);
  const trainee = traineeStore((state) => state.trainee);
  const router = useRouter();

  useEffect(() => {
    const fetchTrainers = (trainers: any, email: string) => {
      return trainers.filter((trainer: any) => trainer.email !== email);
    };

    fetch("/api/trainer")
      .then((res) => res.json())
      .then((data) => {
        const filtered = fetchTrainers(data, trainee?.email || "")
        setTrainers(filtered);
      })
      .catch((err) => console.error("שגיאה בטעינת מאמנים:", err));
    setIsLoading(false);
  }, [trainee]);

  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>();
    trainers.forEach((trainer) => {
      const types: string[] =
        trainer.types ??
        trainer.trainigTypes ??
        trainer.trainingTypes ??
        [];
      types
        .filter((type: string | undefined) => Boolean(type))
        .forEach((type: string) => typeSet.add(type));
    });
    return Array.from(typeSet).sort();
  }, [trainers]);

  const availableTrainerNames = useMemo(() => {
    const nameSet = new Set<string>();
    trainers.forEach((trainer) => {
      if (trainer.name) {
        nameSet.add(trainer.name as string);
      }
    });
    return Array.from(nameSet).sort();
  }, [trainers]);

  const filtered = useMemo(() => {
    const list = selectedTrainer
      ? trainers.filter((t) => t.name?.includes(selectedTrainer))
      : trainers;

    const normalizedName = appliedFilters.trainerName.trim().toLowerCase();

    const normalizeToTokens = (s?: string) => {
      if (!s) return [];

      const cleaned = s
        .toString()
        .normalize("NFKC") 
        .replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, "") 
        .replace(/[^\p{L}\p{N}]+/gu, " ") 
        .trim()
        .toLowerCase();
      return cleaned ? cleaned.split(/\s+/) : [];
    };

    const filterTokens = normalizeToTokens(appliedFilters.location);

    return list.filter((trainer) => {
      const types: string[] =
        trainer.types ?? trainer.trainigTypes ?? trainer.trainingTypes ?? [];

      const rawAddress = (trainer.address ?? trainer.city ?? "").toString();

      const addressTokens = normalizeToTokens(rawAddress);

      const name = (trainer.name ?? "").toString();

      const matchesType =
        appliedFilters.types.length === 0 ||
        appliedFilters.types.some((type) =>
          types.map((t: string) => t?.toLowerCase()).includes(type.toLowerCase())
        );

      const matchesTrainerName =
        !normalizedName || name.toLowerCase().includes(normalizedName);

      const matchesLocation =
        filterTokens.length === 0 ||
        filterTokens.every((tok) => addressTokens.includes(tok));

      return matchesType && matchesTrainerName && matchesLocation;
    });
  }, [trainers, selectedTrainer, appliedFilters]);


  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(defaultTrainingFilters);
    setAppliedFilters(defaultTrainingFilters);
  };

  const goToTrainerSession = (trainer: any) => {
    localStorage.setItem("selectedTrainer", JSON.stringify(trainer));
    router.push("searchTraining/trainer-session");
  };

  function renderStars(rating: number) {
    const filled = Math.round(rating);       // כוכבים מלאים
    const empty = 5 - filled;                // כוכבים ריקים

    return "★".repeat(filled) + "☆".repeat(empty);
  }


  if (isLoading) {
    return (
      <div>
        <UniversalHeader role="trainee" />
        <p>טוען נתונים…</p>
      </div>
    );
  }

  return (
    <div className={styles["search-page"]}>
      <UniversalHeader role="trainee" />

      {/* אזור חיפוש */}
      <div className={styles["search-container"]}>
        {/* dropdown */}
        <div className={styles["trainer-dropdown"]}>

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
        {filtered.length === 0 ? (
          <p>אין אימונים להצגה</p>
        ) : (
          filtered.map((t) => (
            <div
              key={t._id}
              className={styles["trainer-card"]}
              onClick={() => goToTrainerSession(t)}
            >
              <p>מאמן: {t.name}</p>
              <p>מיקום: {t.address || "—"}</p>
              {/* מחשוב ממוצע דירוג */}
              {(() => {
                if (t.comments.length === 0) {
                  return;
                }
                const rating =
                  t.comments && t.comments.length > 0
                    ? t.comments.reduce((sum: number, c: any) => sum + (c.rating ?? 0), 0) /
                    t.comments.length
                    : 0;
                return <p>דירוג: {renderStars(rating)}</p>;
              })()}
            </div>
          ))
        )}
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        values={draftFilters}
        availableTypes={availableTypes}
        availableTrainerNames={availableTrainerNames}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
