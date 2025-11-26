"use client";

import UniversalHeader from "@/components/header/header";
import { FormEvent, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { traineeStore } from "@/store/traineeStore";

export default function AddCommentPage() {
  const searchParams = useSearchParams();
  const trainerId = useMemo(() => searchParams.get("trainerId") ?? "", [searchParams]);
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trainerId) {
      setError("חסר מזהה אימון תקין.");
      return;
    }

    if (rating === 0) {
      setError("בחר לפחות כוכב אחד.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // קריאה ל-API מסודר של המאמן
      const response = await fetch(`/api/trainer/${trainerId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          traineeId: traineeStore.getState().trainee?.id,
        }),
      });

      if (!response.ok) {
        const resText = await response.text();
        console.error("Server response:", resText);
        throw new Error("שמירת הביקורת נכשלה");
      }

      setSuccess(true);

      // סגירה או ניווט חזרה להיסטוריה לאחר זמן קצר
      setTimeout(() => {
        router.push("/dashboard/trainee/trainingsHistory");
      }, 1200);

    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בשמירת הביקורת");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UniversalHeader role="trainee" />
      <div style={{ padding: "2rem" }}>
        <h2>השארת ביקורת על אימון</h2>

        {!trainerId && (
          <p style={{ color: "red" }}>
            לא נמצא אימון לכתיבת ביקורת. חזור להיסטוריית האימונים ונסה שוב.
          </p>
        )}

        {trainerId && (
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
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                style={{ width: "100%", marginTop: "0.5rem" }}
                placeholder="שתף אותנו בתחושותיך מהאימון"
              />
            </label>

            {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
            {success && <p style={{ color: "green", marginBottom: "1rem" }}>תודה! הביקורת נשמרה.</p>}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="button" onClick={() => router.back()} disabled={isSubmitting}>
                חזור
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "שומר..." : "שלח ביקורת"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
