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

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const yesterdayTrainings  = await collection.find({
            date: yesterdayStr
        }).toArray();

        for (const t of yesterdayTrainings ) {

            const oldDate = new Date(t.date);
            const newDate = new Date(oldDate);
            newDate.setDate(oldDate.getDate() + 7);

            const newDateStr = newDate.toISOString().split("T")[0];

            const exists = await collection.findOne({
                date: newDateStr,
                from: t.from,
                to: t.to,
                trainerId: t.trainerId,
                type: t.type,
                classType: t.classType,
            });

            if (!exists) {
                await collection.insertOne({
                    day: t.day,
                    from: t.from,
                    to: t.to,
                    trainerId: t.trainerId,
                    type: t.type,
                    classType: t.classType,
                    date: newDateStr,
                });
            }
        }

        return NextResponse.json({ ok: true, created: yesterdayTrainings .length });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }
}
