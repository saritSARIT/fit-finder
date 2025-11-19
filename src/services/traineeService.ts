import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { client } from "../lib/mongo";
import { TraineeSchema } from "@/lib/validation/Trainee";
import { ca } from "zod/locales";

//שליפת אימונים של מתאמן לפי מזהה מתאמן
export async function getTraineeTrainings(traineeId: string) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Training");

        const trainings = await collection.find({ traineeId: new ObjectId(traineeId) }).toArray();
        if (trainings.length === 0) {
            return NextResponse.json({ message: "No trainings found for this trainee" }, { status: 404 });
        }

        return NextResponse.json(trainings);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// עריכת פרטי מאמן (עבור עמוד אישי או ניהול)
export async function editTraineeDetails(id: string, updates: any) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainee");

        // ולידציה עם Zod
        const parsed = TraineeSchema.safeParse(updates);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((e: any) => e.message);
            return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
        }

        const objectId = new ObjectId(id);
        const result = await collection.updateOne(
            { _id: objectId },
            { $set: parsed.data }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Trainee updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

//ביטול אימון של מתאמן
export async function deleteTraineeTraining(traineeId: string, trainingId: string) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Training");

        const result = await collection.deleteOne({
            _id: new ObjectId(trainingId),
            traineeId: new ObjectId(traineeId)
        });
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Training not found or not authorized" }, { status: 404 });
        }
        return NextResponse.json({ message: "Training deleted successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

//הוספת תגובה לאימון
  export async function addTrainingFeedback(trainingId: string, feedback: string) {
    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Training");

        const result = await collection.updateOne(
            { _id: new ObjectId(trainingId) },
            { $set: { feedback: feedback } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Training not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Feedback added successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}       
    