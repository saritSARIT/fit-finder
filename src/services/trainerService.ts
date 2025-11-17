import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { client } from "../server/mongo";
import { TrainerSchema } from "@/models/Trainer";

// שליפת מאמן לפי מזהה (_id)
export async function getTrainerById(id: string) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainer");

        const objectId = new ObjectId(id);
        const trainer = await collection.findOne({ _id: objectId });

        if (!trainer) {
            return NextResponse.json({ message: "Trainer not found" }, { status: 404 });
        }

        return NextResponse.json(trainer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// עריכת פרטי מאמן (עבור עמוד אישי או ניהול)
export async function editTrainerDetails(id: string, updates: any) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainer");

        // ולידציה עם Zod
        const parsed = TrainerSchema.safeParse(updates);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(e => e.message);
            return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
        }

        const objectId = new ObjectId(id);
        const result = await collection.updateOne(
            { _id: objectId },
            { $set: parsed.data }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Trainer not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Trainer updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// שליפת כל האימונים של מאמן
export async function getTrainerTrainings(trainerId: string) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Training");
        const trainings = await collection.find({ trainerId: trainerId }).toArray();
        return NextResponse.json(trainings);
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// אישור או דחיית אימון על ידי מאמן
export async function approveOrReject(trainingId: string, status: "approved" | "rejected") {
    try {
        const db = client.db("FitFinder");
        const trainingsCollection = db.collection("Training");

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        const objectId = new ObjectId(trainingId);
        const result = await trainingsCollection.updateOne(
            { _id: objectId },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Training not found" }, { status: 404 });
        }

        return NextResponse.json({ message: `Training ${status}` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// שליפת כל התגובות על מאמן
export async function getCommentsTrainer(trainerId: string) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainer");

        const trainer = await collection.findOne(
            { _id: new ObjectId(trainerId) },
            { projection: { comments: 1, _id: 0 } }
        );

        if (!trainer) {
            return NextResponse.json({ message: "Trainer not found" }, { status: 404 });
        }

        return NextResponse.json(trainer.comments || []);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}