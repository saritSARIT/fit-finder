"use client";

import React from "react";
import UniversalHeader from "@/components/header/header";
import styles from "./style.module.css"; // שינוי כאן

export default function PersonalDetailsPage() {
  return ( 
    <div className={styles.pdContainer}>

      <UniversalHeader role="trainer" />

      {/* ------ FILTERS ------ */}
      <div className={styles.pdFilters}>
        <div className={styles.pdFilterBox}>סוג אימון:</div>
        <div className={styles.pdFilterBox}>מקום אימון:</div>
      </div>

      {/* ------ TABLE ------ */}
      <table className={styles.pdTable}>
        <thead>
          <tr>
            <th>ראשון</th>
            <th>שני</th>
            <th>שלישי</th>
            <th>רביעי</th>
            <th>חמישי</th>
            <th>שישי</th>
            <th>שבת</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            {/* ראשון */}
            <td className={styles.pdCell}>
              <div className={styles.pdTrainingBox}>
                <strong>1</strong>
                <p>משעה:</p>
                <p>עד שעה:</p>
                <p>אימון קבוצתי</p>
                <p>(סוג אימון: )</p>
                <p>אימון אישי</p>
              </div>
            </td>

            {/* שאר הימים */}
            <td className={styles.pdCell}></td>
            <td className={styles.pdCell}></td>
            <td className={styles.pdCell}></td>
            <td className={styles.pdCell}></td>
            <td className={styles.pdCell}></td>
            <td className={styles.pdCell}></td>
          </tr>
        </tbody>
      </table>

      {/* ------ ADD TRAINING ------ */}
      <button className={styles.pdAddBtn}>הוספת אימון</button>

      {/* ------ SAVE ------ */}
      <div className={styles.pdSaveWrapper}>
        <button className={styles.pdSaveBtn}>שמירת שינויים</button>
      </div>
    </div>
  );
}
