"use client";

import { traineeStore } from "@/store/traineeStore";
import { FormEvent, useState } from "react";

interface AddCommentFormProps {
  trainingId: string;
  trainerId: string;
  onClose?: () => void;
}

export default function AddCommentForm({ trainingId,trainerId, onClose }: AddCommentFormProps) {
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
      setError("בחר לפחות כוכב אחד.");
      return;
    }

    if (!trainerId) { // בדיקה נוספת
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
        body: JSON.stringify({ rating, comment, traineeId: traineeStore.getState().trainee?.id }),
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
    <div>
      <h2>השארת ביקורת על אימון</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          דירוג האימון:
          <div style={{ marginTop: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  fontSize: "1.75rem",
                  color: star <= rating ? "#f5c518" : "#ccc",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={`דירוג ${star} כוכבים`}
              >
                ★
              </button>
            ))}
          </div>
        </label>

        <label style={{ display: "block", marginBottom: "1rem" }}>
          הערה על האימון:
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            style={{ width: "100%", marginTop: "0.5rem" }}
            placeholder="שתף אותנו בתחושותיך מהאימון"
          />
        </label>

        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "green", marginBottom: "1rem" }}>
            תודה! הביקורת נשמרה.
          </p>
        )}

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            סגור
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "שומר..." : "שלח ביקורת"}
          </button>
        </div>
      </form>
    </div>
  );
}
