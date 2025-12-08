import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 400 });
    }
    try {
        const client = await clientPromise;
        const db = client.db("FitFinder");
        const collection = db.collection("Training");

        // היום בתאריך "YYYY-MM-DD"
        const todayStr = new Date().toISOString().split("T")[0];

        // שליפת כל האימונים של היום בלבד
        const todayTrainings = await collection.find({
            date: todayStr
        }).toArray();

        for (const t of todayTrainings) {

            // יצירת תאריך לשבוע הבא
            const oldDate = new Date(t.date);
            const newDate = new Date(oldDate);
            newDate.setDate(oldDate.getDate() + 7);

            const newDateStr = newDate.toISOString().split("T")[0];

            // בדיקה כדי שלא יהיו כפילויות
            const exists = await collection.findOne({
                date: newDateStr,
                from: t.from,
                to: t.to,
                trainerId: t.trainerId,
                type: t.type,
                classType: t.classType,
            });

            // יצירה רק אם לא קיים
            if (!exists) {
                await collection.insertOne({
                    ...t,
                    _id: undefined,
                    date: newDateStr,
                    trainees: [],
                });
            }
        }

        return NextResponse.json({ ok: true, created: todayTrainings.length });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }
}
