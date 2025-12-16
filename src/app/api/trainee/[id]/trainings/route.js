import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

const client = await clientPromise;

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Training");

    const trainings = await collection
      .find({ traineeId: id })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(trainings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
