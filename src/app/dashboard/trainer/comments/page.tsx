"use client";
import UniversalHeader from "@/components/header/header";
import { getCommentsTrainer } from "@/services/trainerService";
import { trainerStore } from "@/store/trainerStore";
import { useState, useEffect } from "react";
import styles from "./comments.module.css";
import Loader from "@/components/loader/Loader";

export default function CommentsPage() {
  const trainer = trainerStore(state => state.trainer);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      if (!trainer?.id) return;
      const comments = await getCommentsTrainer(trainer.id);
      setComments(comments);
      setIsLoading(false);
    };
    fetchComments();
  }, [])

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <UniversalHeader role="trainer" />
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UniversalHeader role="trainer" />

      {comments.length === 0 && (
        <p className={styles.noComments}>אין כרגע עדיין ביקורות</p>
      )}

      <div className={styles.commentsList}>
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