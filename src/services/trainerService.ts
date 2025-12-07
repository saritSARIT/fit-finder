import { trainerStore } from "@/store/trainerStore";

//מעבר לפרופיל מאמן
export async function moveToTrainer(id: string, email: string, name: string) {
    const setTrainer = trainerStore.getState().setTrainer;
    // const { id: userId } = traineeStore.getState();
    try {
        const res = await fetch(`/api/trainer`);
        const allTrainers = await res.json();

        // מציאת מאמן לפי מייל
        const trainer = allTrainers.find((t: any) => t.email === email);

        // אם המאמן לא קיים – צור אותו
        if (!trainer) {
            const createRes = await fetch(`/api/trainer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name }),
            });

            const data = await createRes.json();

            setTrainer({
                id: data.user.id.insertedId,
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
    const res = await fetch(`/api/trainer/${id}`);
    return await res.json();
}


// עריכת פרטי מאמן
export async function editTrainerDetails(id: string, updates: any) {
    const res = await fetch(`/api/trainer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    return await res.json();
}


// שליפת כל האימונים של מאמן
export async function getTrainerTrainings(trainerId: string) {
    const res = await fetch(`/api/training`);
    const trainings = await res.json();
    return trainings.filter((t: any) => t.trainerId === trainerId);
}


// אישור / דחייה
export async function approveOrReject(
    trainingId: string,
    traineeId: string,
    status: "approved" | "rejected"
) {
    // קודם, שולפים את האימון הקיים
    const getRes = await fetch(`/api/training/${trainingId}`);
    if (!getRes.ok) throw new Error("Training not found");
    const training = await getRes.json();

    // יוצרים את מערך ה-trainees המעודכן
    const updatedTrainees = training.trainees.map((t: any) =>
        t.id === traineeId ? { ...t, status } : t
    );

    // שולחים עדכון
    const res = await fetch(`/api/training/${trainingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainees: updatedTrainees }),
    });

    if (!res.ok) throw new Error("Failed to update status");

    return await res.json();
}



// שליפת תגובות על מאמן
export async function getCommentsTrainer(trainerId: string) {
    const res = await fetch(`/api/trainer/${trainerId}`);
    const data = await res.json();
    return data.comments;
}
