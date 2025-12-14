import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import bcrypt from "bcryptjs";

const client = await clientPromise;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "חסר מייל או סיסמא" }, { status: 400 });
    }

    const db = client.db("FitFinder");
    const users = db.collection("Trainee");

    // חיפוש המשתמש לפי אימייל
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "משתמש לא קיים" }, { status: 404 });
    }

    // בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "סיסמא שגויה" }, { status: 401 });
    }

    // התחברות מוצלחת
    return NextResponse.json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
