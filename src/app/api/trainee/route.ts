import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongo";

const client = await clientPromise;

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, phone, image } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "שם ואימייל הם שדות חובה" },
        { status: 400 }
      );
    }

    const db = client.db("FitFinder");
    const traineesCollection = db.collection("Trainee");

    const result = await traineesCollection.updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          email,
          phone: phone || "",
          image: image || "/images/UserProfile.png",
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "פרטים עודכנו בהצלחה!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trainee:", error);
    return NextResponse.json(
      { message: "שגיאה בעדכון הפרטים" },
      { status: 500 }
    );
  }
}
