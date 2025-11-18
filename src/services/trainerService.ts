import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { client } from "../lib/mongo";
import { TrainerSchema } from "@/lib/validation/Trainer";

// שליפת מאמן לפי מזהה (_id)
export async function getTrainerById(id: string) {

    try {
        const res = await fetch(`http://localhost:3000/api/trainer/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// עריכת פרטי מאמן
export async function editTrainerDetails(id: string, updates: any) {
    try {
        const res = await fetch(`http://localhost:3000/api/trainer/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// שליפת כל האימונים של מאמן
export async function getTrainerTrainings(trainerId: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/training`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const trainings = data.filter((training: any) => training.trainerId === trainerId);
        return NextResponse.json(trainings);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// אישור או דחיית אימון על ידי מאמן
export async function approveOrReject(trainingId: string, status: "approved" | "rejected") {
    try {
        const res = await fetch(`http://localhost:3000/api/training/${trainingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// שליפת כל התגובות על מאמן
export async function getCommentsTrainer(trainerId: string) {

    try {
        const res = await fetch(`http://localhost:3000/api/trainer/${trainerId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        return NextResponse.json(data.comments);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}