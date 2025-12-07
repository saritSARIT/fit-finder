"use client";

import styles from "./filter.module.css";
import { ChangeEvent } from "react";

export type TrainingFilters = {
  types: string[];
  location: string;
  trainerName: string;
};

export const defaultTrainingFilters: TrainingFilters = {
  types: [],
  location: "",
  trainerName: "",
};

export interface FilterPanelProps {
  isOpen: boolean;
  values: TrainingFilters;
  availableTypes: string[];
  availableTrainerNames: string[];
  onChange: (next: TrainingFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

const ensureNumber = (value: string) => {
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? value : "";
};

export default function FilterPanel({
  isOpen,
  values,
  availableTypes,
  availableTrainerNames,
  onChange,
  onApply,
  onReset,
  onClose,
}: FilterPanelProps) {
  if (!isOpen) return null;

  const handleFieldChange = (partial: Partial<TrainingFilters>) => {
    onChange({ ...values, ...partial });
  };

  const handlePriceChange =
    (key: "minPrice" | "maxPrice") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFieldChange({
        [key]: ensureNumber(event.target.value),
      } as Partial<TrainingFilters>);
    };

  const toggleType = (type: string) => {
    const nextTypes = values.types.includes(type)
      ? values.types.filter((item) => item !== type)
      : [...values.types, type];
    handleFieldChange({ types: nextTypes });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.title}>סינון חכם</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="סגור חלון סינון"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <label htmlFor="trainer-name-input">שם מאמן</label>
            <select
              id="trainer-name-input"
              value={values.trainerName}
              onChange={(event) =>
                handleFieldChange({ trainerName: event.target.value })
              }
            >
              <option value="">כל המאמנים</option>
              {availableTrainerNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </section>

          <section className={styles.section}>
            <label>סוג אימון</label>
            <div className={styles.checkboxGroup}>
              {availableTypes.length === 0 && <span>אין סוגים זמינים</span>}
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.chip} ${
                    values.types.includes(type) ? styles.active : ""
                  }`}
                  onClick={() => toggleType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <label htmlFor="location-input">מיקום</label>
            <input
              id="location-input"
              type="text"
              value={values.location}
              onChange={(event) =>
                handleFieldChange({ location: event.target.value })
              }
              placeholder="עיר, שכונה או כתובת"
            />
          </section>

        </div>

        <div className={styles.actions}>
          <button className={styles.applyBtn} onClick={onApply}>
            החל סינון
          </button>
          <button className={styles.resetBtn} onClick={onReset}>
            אפס הכל
          </button>
        </div>
      </div>
    </div>
  );
}

