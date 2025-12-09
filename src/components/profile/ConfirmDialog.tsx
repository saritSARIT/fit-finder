"use client";

import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  cancelText = "ביטול",
  confirmText = "אישור",
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalText}>{message}</p>

        <div className={styles.modalButtons}>
          <button
            className={styles.modalCancel}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={styles.modalConfirm}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "טוען..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
