"use client";

import { useState } from "react";
import { useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import styles from "./EditProfileModal.module.css";
import { showToast } from "../toast/Toast";
import { traineeStore } from "@/store/traineeStore";

interface EditProfileModalProps {
  isOpen?: boolean;
  isInline?: boolean;
  onClose?: () => void;
  onSave?: () => void;
}

export default function EditProfileModal({ 
  isOpen = false, 
  isInline = false, 
  onClose, 
  onSave 
}: EditProfileModalProps) {
  const { data: session } = useSession();
  const trainee = traineeStore((s) => s.trainee);
  const [isLoading, setIsLoading] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: trainee?.name || session?.user?.name || "",
    email: trainee?.email || session?.user?.email || "",
    phone: (trainee as any)?.phone || (session?.user as any)?.phone || "",
    image: trainee?.image || session?.user?.image || "/images/UserProfile.png",
  });

  const [previewImage, setPreviewImage] = useState(formData.image);

  useEffect(() => {
    // Sync form when the modal opens or when trainee/session changes
    const newData = {
      name: trainee?.name || session?.user?.name || "",
      email: trainee?.email || session?.user?.email || "",
      phone: (trainee as any)?.phone || (session?.user as any)?.phone || "",
      image: trainee?.image || session?.user?.image || "/images/UserProfile.png",
    };
    console.debug("EditProfileModal init", { trainee, session, isOpen, isInline });
    setFormData(newData);
    setPreviewImage(newData.image);
  }, [trainee, session, isOpen, isInline]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      showToast("שם ואימייל הם שדות חובה");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/trainee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          image: formData.image,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        showToast(data.message || "שגיאה בעדכון הפרטים");
        return;
      }

      showToast("פרטים עודכנו בהצלחה!");
      try {
        const setTrainee = traineeStore.getState().setTrainee;
        setTrainee({
          id: (session as any)?.user?.id || traineeStore.getState().trainee?.id || "",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          image: formData.image || "/images/UserProfile.png",
        });
      } catch (err) {
        console.warn("Couldn't update trainee store:", err);
      }

      setEditField(null);
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("שגיאה בעדכון הפרטים");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isInline) return null;

  
  if (isInline) {
    return (
      <div className={styles.inlineEditContainer}>

        <div className={styles.inlineEditField}>
          <label>שם</label>
          {editField === "name" ? (
            <div className={styles.inlineInputGroup}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
                disabled={isLoading}
              />
              <button onClick={handleSubmit} disabled={isLoading}>✓</button>
              <button onClick={() => setEditField(null)} disabled={isLoading}>✕</button>
            </div>
          ) : (
            <div className={styles.inlineFieldDisplay}>
              <span>{formData.name}</span>
              <button 
                className={styles.editPencil}
                onClick={() => setEditField("name")}
                title="עריכה"
                aria-label="ערוך שם"
              >
                <FiEdit2 />
              </button>
            </div>
          )}
        </div>

        <div className={styles.inlineEditField}>
          <label>אימייל</label>
          {editField === "email" ? (
            <div className={styles.inlineInputGroup}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoFocus
                disabled={isLoading}
              />
              <button onClick={handleSubmit} disabled={isLoading}>✓</button>
              <button onClick={() => setEditField(null)} disabled={isLoading}>✕</button>
            </div>
          ) : (
            <div className={styles.inlineFieldDisplay}>
              <span>{formData.email}</span>
              <button 
                className={styles.editPencil}
                onClick={() => setEditField("email")}
                title="עריכה"
                aria-label="ערוך אימייל"
              >
                <FiEdit2 />
              </button>
            </div>
          )}
        </div>

        <div className={styles.inlineEditField}>
          <label>טלפון</label>
          {editField === "phone" ? (
            <div className={styles.inlineInputGroup}>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                autoFocus
                disabled={isLoading}
              />
              <button onClick={handleSubmit} disabled={isLoading}>✓</button>
              <button onClick={() => setEditField(null)} disabled={isLoading}>✕</button>
            </div>
          ) : (
            <div className={styles.inlineFieldDisplay}>
              <span>{formData.phone || "לא הוזן"}</span>
              <button 
                className={styles.editPencil}
                onClick={() => setEditField("phone")}
                title="עריכה"
                aria-label="ערוך טלפון"
              >
                <FiEdit2 />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editModalOverlay}>
      <div className={styles.editModalContent}>
        <button
          className={styles.editCloseBtn}
          onClick={onClose}
          disabled={isLoading}
        >
          ✕
        </button>

        <h2 className={styles.editTitle}>עריכת פרטים אישיים</h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>תמונת פרופיל</label>
          <div className={styles.imagePreview}>
            <img src={previewImage} alt="Profile preview" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
            disabled={isLoading}
          />
          <span className={styles.fileLabel}>בחר תמונה</span>
        </div> 

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>שם</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.formInput}
            disabled={isLoading}
            placeholder="הכנס שם מלא"
          />
        </div> 

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>אימייל</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.formInput}
            disabled={isLoading}
            placeholder="הכנס אימייל"
          />
        </div> 

         <div className={styles.formGroup}>
          <label className={styles.formLabel}>טלפון</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={styles.formInput}
            disabled={isLoading}
            placeholder="הכנס מספר טלפון"
          />
        </div>

        <div className={styles.editButtons}>
          <button
            className={styles.editCancel}
            onClick={onClose}
            disabled={isLoading}
          >
            ביטול
          </button>
          <button
            className={styles.editSave}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "שומר..." : "שמור שינויים"}
          </button>
        </div>
      </div>
    </div>
  );
}
