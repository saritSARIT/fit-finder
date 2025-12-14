import { TrainingSummary } from "@/types/trainingSummary";
import { Training } from "@/types/training";

export const isTrainingInPast = (training: TrainingSummary) => {
    if (!training?.date || !training?.to) return false;

    // parse date YYYY-MM-DD
    const [yearStr, monthStr, dayStr] = training.date.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr); // 1..12
    const day = Number(dayStr);

    // parse 'to' time HH:MM
    const [hourStr, minStr] = training.to.split(":").map(Number);
    const hour = Number(hourStr);
    const minute = Number(minStr);

    const trainingEnd = new Date(year, month - 1, day, hour, minute, 0, 0);
    const now = new Date();

    return trainingEnd < now;
};

export const isTrainingInFuture = (training: Training) => {
    const now = new Date();
    const trainingDate = new Date(training.date);
    return (
        trainingDate.getFullYear() > now.getFullYear() ||
        (trainingDate.getFullYear() === now.getFullYear() &&
            (trainingDate.getMonth() > now.getMonth() ||
                (trainingDate.getMonth() === now.getMonth() &&
                    trainingDate.getDate() >= now.getDate())))
    );
};

// מקבל אינדקס יום (0=ראשון...6=שבת) ומחזיר תאריך YYYY-MM-DD
export function getNextDateForDay(dayIndex: number) {
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sunday ... 6 = Saturday

    let diff = dayIndex - currentDayIndex;
    if (diff < 0) diff += 7;

    const d = new Date(today);
    d.setDate(today.getDate() + diff);

    return d.toISOString().split("T")[0];
}
