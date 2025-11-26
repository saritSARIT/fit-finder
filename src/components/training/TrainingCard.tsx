
"use client";

interface Props {
  trainingId: string;
  trainerId: string;
  date?: string;
  type?: string;
  status?: string;
  onAddComment?: (trainingId: string, trainerId: string) => void;
}

export default function TrainingCard({ 
  trainingId, 
  trainerId, 
  date, 
  type, 
  status, 
  onAddComment 
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {date || "תאריך לא זמין"}
      </div>

      <div style={{ color: "#555" }}>
        סוג אימון: {type || "לא זמין"}
      </div>

      <div style={{ color: "#888" }}>
        סטטוס: {status || "לא ידוע"}
      </div>

      <button
        onClick={() => onAddComment?.(trainingId, trainerId)} // ✅ מעביר גם trainerId
        style={{
          marginTop: "0.5rem",
          alignSelf: "flex-start",
          background: "#0070f3",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        הוסף ביקורת
      </button>
    </div>
  );
}