import { NextResponse } from "next/server";
import { client } from "../../../lib/mongo";
import { TrainerSchema } from "../../../lib/validation/Trainer";


// שליפת כל המאמנים
export async function GET() {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainer");
    const trainers = await collection.find({}).toArray();
    return NextResponse.json(trainers);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// יצירת מאמן חדש
export async function POST(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainer");
    const data = await request.json();

    // שלב הולידציה
    const parsed = TrainerSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const existing = await collection.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    parsed.data.trainigTypes = [];
    parsed.data.address = "";
    parsed.data.comments = [];

    const id = await collection.insertOne(parsed.data);

    return NextResponse.json({ message: "Trainer added successfully", user: { id: id, email: parsed.data.email, name: parsed.data.name } },
      { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
