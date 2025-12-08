"use client";

import styles from "./filter.module.css";
import { ChangeEvent } from "react";
import React, { useState, useEffect } from "react";

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


  const [addressQuery, setAddressQuery] = useState(values.location);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressQuery || addressQuery.trim().length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      try {
        setAddressLoading(true);
        setAddressError(null);

        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          addressQuery
        )}&lang=he&limit=5&types=street,locality,housenumber&apiKey=1ab0a67899de4c979ee070413cd49be2`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch, status: ${res.status}`);

        const data = await res.json();

        const suggestions =
          data?.features?.map((f: any) => {
            const street = f.properties.street || "";
            const number = f.properties.housenumber || "";
            const city = f.properties.city || "";
            return `${street} ${number}, ${city}`.trim();
          }) ?? [];

        setAddressSuggestions(suggestions);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setAddressError("לא ניתן לטעון הצעות כרגע");
          setAddressSuggestions([]);
        }
      } finally {
        setAddressLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [addressQuery]);



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
          <h3 className={styles.title}>סנן לפי:</h3>
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
                  className={`${styles.chip} ${values.types.includes(type) ? styles.active : ""
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
              value={addressQuery}
              list="location-suggestions"
              onChange={(e) => {
                setAddressQuery(e.target.value);
                handleFieldChange({ location: e.target.value });
              }}
              placeholder="עיר, רחוב או כתובת מלאה"
            />

            <datalist id="location-suggestions">
              {addressSuggestions.map((s, idx) => (
                <option key={`${s}-${idx}`} value={s} />
              ))}
            </datalist>

            {addressLoading && <small>טוען הצעות…</small>}
            {addressError && (
              <small style={{ color: "red" }}>{addressError}</small>
            )}
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

