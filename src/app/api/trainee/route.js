import { NextResponse } from "next/server";
import { client } from "../../services/server/mongo";
import { TraineeSchema } from "../../../models/Trainee";


// שליפת כל המתאמנים
export async function GET() {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainee");
    const trainees = await collection.find({}).toArray();
    return NextResponse.json(trainees);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// יצירת מתאמן חדש
export async function POST(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainee");
    const data = await request.json();

    // שלב הולידציה
    const parsed = TraineeSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const existing = await collection.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Trainee added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}