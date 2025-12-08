"use client";

import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

let externalShowToast: ((msg: string) => void) | null = null;

export function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    externalShowToast = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 4000); // תמיד 3 שניות
    };
  }, []);

  if (!message) return null;

  return <div className={styles.toast}>{message}</div>;
}

// פונקציה גלובלית לשימוש בכל מקום
export function showToast(msg: string) {
  externalShowToast && externalShowToast(msg);
}
