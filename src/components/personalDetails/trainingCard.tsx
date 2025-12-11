import { Training } from "@/types/training"
import styles from '@/app/dashboard/trainer/personalDetails/personalDetails.module.css';

export default function TrainingCard({ t, i, index, trainerTypes, trainings, setTrainings }:
    { t: Training; i: any; index: number, trainerTypes: string[], trainings: Training[], setTrainings: any }) {

    const updateTraining = <K extends keyof Training>(
        index: number,
        field: K,
        value: Training[K]
    ) => {
        const updated = [...trainings];
        updated[index][field] = value;
        setTrainings(updated);
    };

    const deleteTraining = (index: number) => {
        setTrainings((prev: any) => prev.filter((_: any, i: any) => i !== index));
    };

    return (
        <div className={styles.pdTrainingBox}>
            <hr />
            <strong>אימון {i + 1}</strong>
            <br />

            <label>משעה:</label>
            <input
                type="time"
                value={t.from}
                onChange={(e) =>
                    updateTraining(index, "from", e.target.value)
                }
            />
            <br />
            <label>עד שעה:</label>
            <input
                type="time"
                value={t.to}
                onChange={(e) =>
                    updateTraining(index, "to", e.target.value)
                }
            />
            <br />

            <div>
                <label>
                    <input
                        type="radio"
                        name={`classType-${index}`}
                        checked={t.classType === "personal"}
                        onChange={() => {
                            updateTraining(index, "classType", "personal");
                            updateTraining(index, "type", "");
                        }
                        }
                    />
                    אישי
                </label>

                <label>
                    <input
                        type="radio"
                        name={`classType-${index}`}
                        checked={t.classType === "group"}
                        onChange={() =>
                            updateTraining(index, "classType", "group")
                        }
                    />
                    קבוצתי
                </label>
            </div>
            {t.classType === "group" && (
                <>
                    <label>סוג אימון:</label>
                    <select
                        value={t.type}
                        onChange={(e) =>
                            updateTraining(index, "type", e.target.value)
                        }
                    >
                        {trainerTypes.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </>
            )}
            <br />

            <button className={styles.deleteBtn}
                type="button"
                onClick={() => deleteTraining(index)}
            >
                🗑️
            </button>
        </div>
    )
}