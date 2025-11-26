"use client";

import UniversalHeader from "@/components/header/header";
import { FormEvent, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { traineeStore } from "@/store/traineeStore";

function AddCommentContent() {
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
      setError("חסר מזהה מאמן תקין.");
      return;
    }

    if (rating === 0) {
      setError("בחר לפחות כוכב אחד.");
      return;
    }

    const traineeId = traineeStore.getState().trainee?.id;
    
    if (!traineeId) {
      setError("לא נמצא מזהה משתמש. אנא התחבר מחדש.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      console.log("Sending comment:", { trainerId, rating, comment, traineeId });

      const response = await fetch(`/api/trainer/${trainerId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          traineeId,
        }),
      });

      if (!response.ok) {
        const resText = await response.text();
        console.error("Server response:", resText);
        throw new Error("שמירת הביקורת נכשלה");
      }

      const result = await response.json();
      console.log("Comment saved successfully:", result);
      
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/trainee/trainingsHistory");
      }, 1200);

    } catch (err) {
      console.error("Error saving comment:", err);
      setError("אירעה שגיאה בשמירת הביקורת");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UniversalHeader role="trainee" />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2>השארת ביקורת על המאמן</h2>

        {!trainerId && (
          <p style={{ color: "red" }}>
            לא נמצא מזהה מאמן. חזור להיסטוריית האימונים ונסה שוב.
          </p>
        )}

        {trainerId && (
          <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
            <label style={{ display: "block", marginBottom: "1rem" }}>
              דירוג המאמן:
              <div style={{ marginTop: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "2rem",
                      color: star <= rating ? "#f5c518" : "#ccc",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.25rem",
                      transition: "color 0.2s",
                    }}
                    aria-label={`דירוג ${star} כוכבים`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.9rem" }}>
                  דירוג נבחר: {rating} כוכבים
                </div>
              )}
            </label>

            <label style={{ display: "block", marginBottom: "1rem" }}>
              הערה על המאמן והאימון:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                style={{ 
                  width: "100%", 
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                placeholder="שתף אותנו בחוויה שלך מהאימון והמאמן..."
              />
            </label>

            {error && (
              <p style={{ 
                color: "red", 
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "#fee",
                borderRadius: "8px",
              }}>
                {error}
              </p>
            )}
            
            {success && (
              <p style={{ 
                color: "green", 
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "#efe",
                borderRadius: "8px",
              }}>
                ✓ תודה! הביקורת נשמרה בהצלחה.
              </p>
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button 
                type="button" 
                onClick={() => router.back()} 
                disabled={isSubmitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                חזור
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || rating === 0}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: (isSubmitting || rating === 0) ? "#ccc" : "#0070f3",
                  color: "white",
                  cursor: (isSubmitting || rating === 0) ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {isSubmitting ? "שומר..." : "שלח ביקורת"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default function AddCommentPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>טוען...</p>
      </div>
    }>
      <AddCommentContent />
    </Suspense>
  );
}