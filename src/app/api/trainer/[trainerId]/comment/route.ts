import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { Trainer } from "@/types/trainer";
import { Comment } from "@/types/comment";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ trainerId: string }> }
) {
  try {
    const { trainerId } = await params;
    console.log("Received trainerId:", trainerId);

    const body = await req.json();
    console.log("Request body:", body);

    const { rating, comment, traineeId } = body;

    if (!trainerId) {
      console.error("trainerId is missing!");
      return NextResponse.json({ error: "Missing trainerId" }, { status: 400 });
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
      { _id: new ObjectId(trainerId) },
      { $push: { comments: newComment } }
    );

    console.log("Mongo update result:", result);

    if (result.modifiedCount === 0) {
      console.error("Trainer not found in DB with id:", trainerId);
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in POST /trainer/[trainerId]/comment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}