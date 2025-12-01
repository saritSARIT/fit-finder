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

export default function SearchTrainingPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<TrainingFilters>(defaultTrainingFilters);
  const [appliedFilters, setAppliedFilters] = useState<TrainingFilters>(defaultTrainingFilters);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trainer")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => console.error("שגיאה בטעינת מאמנים:", err));
  }, []);

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

    return list.filter((trainer) => {
      const types: string[] =
        trainer.types ??
        trainer.trainigTypes ??
        trainer.trainingTypes ??
        [];

      const address = trainer.address ?? trainer.city ?? "";
      const rating =
        trainer.averageRating ??
        trainer.rating ??
        (Array.isArray(trainer.comments) && trainer.comments.length > 0
          ? trainer.comments.reduce(
              (sum: number, comment: any) => sum + (comment.rating ?? 0),
              0
            ) / trainer.comments.length
          : 0);
      const cost =
        trainer.price ??
        trainer.minPrice ??
        trainer.rate ??
        trainer.hourlyRate ??
        0;

      const name = trainer.name ?? "";

      const matchesType =
        appliedFilters.types.length === 0 ||
        appliedFilters.types.some((type) =>
          types.map((t: string) => t?.toLowerCase()).includes(type.toLowerCase())
        );
      const matchesTrainerName =
        !normalizedName || name.toLowerCase().includes(normalizedName);
      const matchesLocation =
        !appliedFilters.location ||
        address.toLowerCase().includes(appliedFilters.location.toLowerCase());
      const matchesRating = rating >= appliedFilters.minRating;
      const matchesMinPrice =
        !appliedFilters.minPrice || cost >= Number(appliedFilters.minPrice);
      const matchesMaxPrice =
        !appliedFilters.maxPrice || cost <= Number(appliedFilters.maxPrice);

      return (
        matchesType &&
        matchesTrainerName &&
        matchesLocation &&
        matchesRating &&
        matchesMinPrice &&
        matchesMaxPrice
      );
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
              <p>מאמנים של אותו יום מהשעה {t.time || "—"}</p>
              <p>שהוא נכנס ואילך</p>
              <p>מאמן: {t.name}</p>
              <p>מיקום: {t.address || "—"}</p>
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
