"use client";
import UniversalHeader from "@/components/header/header";
import { getCommentsTrainer } from "@/services/trainerService";
import { trainerStore } from "@/store/trainerStore";
import { useState, useEffect } from "react";
import styles from "./comments.module.css";

export default function CommentsPage() {
  const trainer = trainerStore(state => state.trainer);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!trainer?.id) return;
      const comments = await getCommentsTrainer(trainer.id);
      setComments(comments);

    };
    fetchComments();
  }, [])

  return (
    <div className={styles.container}>
      <UniversalHeader role="trainer" />

      <div className={styles.commentsList}>
        {comments.length === 0 && (
          <p className={styles.noComments}>אין עדיין ביקורות</p>
        )}

        {comments.map((c: any, i) => (
          <div key={i} className={styles.commentCard}>
            <p className={styles.commentName}>{c.traineeName}</p>
            <p>{c.date}</p>
            <p className={styles.commentText}>{c.comment}</p>
            <p className={styles.commentRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= c.rating ? styles.starFilled : styles.starEmpty}
                >
                  {star <= c.rating ? '★' : '✰'}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}