import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";
import { ObjectId } from "mongodb";
import { TraineeSchema } from "../../../../models/Trainee";


//שליפת מתאמן לפי מזהה (_id)
export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainee");
        const trainee = await collection.findOne({ _id: new ObjectId(id) });

        if (!trainee) {
            return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
        }

        return NextResponse.json(trainee);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Invalid ID or server error" }, { status: 500 });
    }
}


// עדכון מתאמן לפי מזהה (_id)
export async function PUT(request, { params }) {
    const { id } = await params;

    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainee");

        const updates = await request.json();

        // ולידציה עם Zod
        const parsed = TraineeSchema.safeParse(updates);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(e => e.message);
            return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
        }

        // בדיקה שהאימייל ייחודי
        if (parsed.data.email) {
            const existing = await collection.findOne({
                email: parsed.data.email,
                _id: { $ne: new ObjectId(id) },
            });
            if (existing) {
                return NextResponse.json({ message: "Email already exists" }, { status: 400 });
            }
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

// מחיקת מתאמן לפי ID
export async function DELETE(request, { params }) {
    const { id } = await params;

    try {
        const db = client.db("FitFinder");
        const collection = db.collection("Trainee");

        const objectId = new ObjectId(id);
        const result = await collection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Trainee deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}