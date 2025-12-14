import { NextRequest, NextResponse } from "next/server";
// import { client } from "@/lib/mongo";
import clientPromise from "@/lib/mongo";
const client = await clientPromise;
import { ObjectId } from "mongodb";
import { Trainer } from "@/types/trainer";
import { Comment } from "@/types/comment";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Received trainerId:", id);

    const body = await req.json();
    console.log("Request body:", body);

    const { rating, comment, traineeId } = body;

    if (!id) {
      console.error("חסר מזהה מאמן!");
      return NextResponse.json({ error: "חסר מזהה מאמן" }, { status: 400 });
    }

    if (!rating || !comment || !traineeId) {
      console.error("Incomplete data:", body);
      return NextResponse.json({ error: "Incomplete comment data" }, { status: 400 });
    }

    const db = client.db("FitFinder");
    const collection = db.collection<Trainer>("Trainer");

    const newComment: Comment = {
      traineeId,
      rating,
      comment,
      date: new Date(),
    };

    console.log("Pushing comment to DB:", newComment);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: newComment } }
    );

    console.log("Mongo update result:", result);

    if (result.modifiedCount === 0) {
      console.error("Trainer not found in DB with id:", id);
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in POST /trainer/[trainerId]/comment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}