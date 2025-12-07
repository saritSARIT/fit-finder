import { useState } from 'react';
import styles from '@/app/dashboard/trainer/personalDetails/personalDetails.module.css';

export default function TypesCard({ trainerTypes, setTrainerTypes }:
    { trainerTypes: string[], setTrainerTypes: any }) {

    const [showTypes, setShowTypes] = useState(false);
    const trainingOptions = ["יוגה", "HIIT", "אירובי", "פילאטיס", "קרוספיט", "אימון כוח", "אימון משקל גוף",
        "שחייה", "ריצה", "טבטה", "קיקבוקס", "איגרוף", " TRX", "מתיחות", "פילאטיס מכשירים", "Core", "אליפטיקל",
        "קפיצות בחבל", "אימון פונקציונלי", "זומבה"];

    const toggleTrainerType = (type: string) => {
        if (trainerTypes.includes(type)) {
            setTrainerTypes(trainerTypes.filter((t) => t !== type));
        } else {
            setTrainerTypes([...trainerTypes, type]);
        }
    };

    return (
        <>
            <label>סוגי אימון:</label>

            <button
                type="button"
                className={styles.typesBtn}
                onClick={() => setShowTypes(!showTypes)}
            >
                בחר סוגי אימון
            </button>

            {showTypes && (
                <div className={styles.typesDropdown}>
                    {trainingOptions.map((option) => (
                        <label key={option} className={styles.typeCheckbox}>
                            <input
                                type="checkbox"
                                className={styles.checkInput}
                                checked={trainerTypes.includes(option)}
                                onChange={() => toggleTrainerType(option)}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
}