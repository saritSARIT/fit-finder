export interface TrainingSummary {
    _id: string;
    date: string;
    from: string;
    to: string;
    trainerId: string;
    trainerName?: string;
    type: string;
    classType: string;
    trainees?: {
        id: string;
        notes?: string;
        status: string;
        name?: string;
    }[];
}