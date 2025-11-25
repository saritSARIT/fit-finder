"use client";

import UniversalHeader from "@/components/header/header";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";

function AddCommentForm() {
  const searchParams = useSearchParams();
  const trainingId = useMemo(
    () => searchParams.get("trainingId") ?? "",
    [searchParams]
  );
  const router = useRouter();

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

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/training/${trainingId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error("שמירת הביקורת נכשלה");
      }

      setSuccess(true);
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
    <div style={{ padding: "2rem" }}>
        <h2>השארת ביקורת על אימון</h2>
        {!trainingId && (
          <p style={{ color: "red" }}>
            לא נמצא אימון לכתיבת ביקורת. חזור להיסטוריית האימונים ונסה שוב.
          </p>
        )}

        {trainingId && (
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
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                חזור
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "שומר..." : "שלח ביקורת"}
              </button>
            </div>
          </form>
        )}
      </div>
  );
}

export default function AddCommentPage() {
  return (
    <>
      <UniversalHeader role="trainee" />
      <Suspense fallback={<div style={{ padding: "2rem" }}>טוען...</div>}>
        <AddCommentForm />
      </Suspense>
    </>
  );
}
