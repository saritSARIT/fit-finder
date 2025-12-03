// שליפת מתאמן לפי מזהה (_id)
export async function getTraineeById(id: string) {
    const res = await fetch(`http://localhost:3000/api/trainee/${id}`);
    return await res.json();
}