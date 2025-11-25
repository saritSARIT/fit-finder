import { trainerStore } from "@/store/trainerStore";

//מעבר לפרופיל מאמן
export async function moveToTrainer(id: string, email: string, name: string) {
    const setTrainer = trainerStore.getState().setTrainer;

    try {
        const res = await fetch(`http://localhost:3000/api/trainer`);
        const allTrainers = await res.json();

        // מציאת מאמן לפי מייל
        const trainer = allTrainers.find((t: any) => t.email === email);

        // אם המאמן לא קיים – צור אותו
        if (!trainer) {
            const createRes = await fetch(`http://localhost:3000/api/trainer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name }),
            });

            const data = await createRes.json();

            setTrainer({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
            });

            return data;
        }

        // אם המאמן קיים
        setTrainer({
            id: trainer._id,
            name: trainer.name,
            email: trainer.email,
        });

        return trainer;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


// שליפת מאמן לפי מזהה (_id)
export async function getTrainerById(id: string) {
    const res = await fetch(`http://localhost:3000/api/trainer/${id}`);
    return await res.json();
}


// עריכת פרטי מאמן
export async function editTrainerDetails(id: string, updates: any) {
    const res = await fetch(`http://localhost:3000/api/trainer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    return await res.json();
}


// שליפת כל האימונים של מאמן
export async function getTrainerTrainings(trainerId: string) {
    const res = await fetch(`http://localhost:3000/api/training`);
    const trainings = await res.json();
    return trainings.filter((t: any) => t.trainerId === trainerId);
}


// אישור / דחייה
export async function approveOrReject(trainingId: string, status: "approved" | "rejected") {
    const res = await fetch(`http://localhost:3000/api/training/${trainingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return await res.json();
}


// שליפת תגובות על מאמן
export async function getCommentsTrainer(trainerId: string) {
    const res = await fetch(`http://localhost:3000/api/trainer/${trainerId}`);
    const data = await res.json();
    return data.comments;
}
