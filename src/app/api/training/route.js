import { NextResponse } from "next/server";
import { client } from "../../services/server/mongo";
import { TrainingSchema } from "../../../models/Training";


// שליפת כל האימונים
export async function GET() {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Training");
    const trainings = await collection.find({}).toArray();
    return NextResponse.json(trainings);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// יצירת אימון חדש
export async function POST(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Training");
    const data = await request.json();

    // שלב הולידציה
    const parsed = TrainingSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Training added successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}