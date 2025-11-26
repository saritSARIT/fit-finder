"use client";
import UniversalHeader from "@/components/header/header";
import { getCommentsTrainer } from "@/services/trainerService";
import { trainerStore } from "@/store/trainerStore";
import { useState, useEffect } from "react";
export default function CommentsPage() {
  const trainer = trainerStore(state => state.trainer);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!trainer?.id) return;
      const comments = await getCommentsTrainer(trainer.id);
      setComments(comments);
      console.log(comments);

    };
    fetchComments();
  }, [])

  return (
    <div>
      <UniversalHeader role="trainer" />

      <h2>ביקורות</h2>

      <div>
        {comments.length === 0 && (
          <p>אין עדיין ביקורות</p>
        )}

        {comments.map((c: any, i) => (
          <div key={i}>
            <p>{c.traineeName}</p>
            <p>{c.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}