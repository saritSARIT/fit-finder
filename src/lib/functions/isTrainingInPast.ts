import { TrainingSummary } from "@/types/trainingSummary";

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