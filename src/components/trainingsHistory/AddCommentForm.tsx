"use client";

import { traineeStore } from "@/store/traineeStore";
import { FormEvent, useState } from "react";
import styles from "./AddCommentForm.module.css";

interface AddCommentFormProps {
  trainingId: string;
  trainerId: string;
  onClose?: () => void;
}

export default function AddCommentForm({
  trainingId,
  trainerId,
  onClose,
}: AddCommentFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trainingId) {
      setError("חסר מזהה אימון תקין.");
      return;
    }

    if (rating === 0) {
      setError("בחר לפחות כוכב אחד!");
      return;
    }

    if (!trainerId) {
      setError("חסר מזהה מאמן תקין.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/trainer/${trainerId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
          traineeId: traineeStore.getState().trainee?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("שמירת הביקורת נכשלה");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose?.();
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בשמירת הביקורת");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>

      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className={styles.closeBtn}
        aria-label="סגור"
      >
        ✖
      </button>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          דירוג האימון:
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${styles.star} ${star <= rating ? styles.starActive : ""
                  }`}
                aria-label={`דירוג ${star} כוכבים`}
              >
                ★
              </button>
            ))}
          </div>
        </label>

        <label className={styles.label}>
          הערה על האימון:
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            className={styles.textarea}
            placeholder="שתף אותנו בתחושותיך מהאימון"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}> הביקורת נשמרה תודה!</p>}




        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? "שומר..." : "שלח ביקורת"}
        </button>

      </form>
    </div>
  );
}
