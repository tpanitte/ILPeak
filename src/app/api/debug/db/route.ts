import { NextResponse } from "next/server";
import clientPromise from "@/infra/db/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    // Inspect ILPeak_App
    const appDb = client.db("ILPeak_App");
    const appCollections = await appDb.listCollections().toArray();
    const appData: Record<string, { count: number; sample: unknown[] }> = {};

    for (const col of appCollections) {
      const collection = appDb.collection(col.name);
      const count = await collection.countDocuments();
      const sample = await collection.find().limit(3).toArray();
      appData[col.name] = { count, sample };
    }

    // Inspect ILPeak_Events
    const eventsDb = client.db("ILPeak_Events");
    const eventsCollections = await eventsDb.listCollections().toArray();
    const eventsData: Record<string, { count: number; sample: unknown[] }> = {};

    for (const col of eventsCollections) {
      const collection = eventsDb.collection(col.name);
      const count = await collection.countDocuments();
      const sample = await collection.find().sort({ _id: -1 }).limit(3).toArray();
      eventsData[col.name] = { count, sample };
    }

    return NextResponse.json({
      status: "connected",
      ILPeak_App: {
        collections: appCollections.map((c) => c.name),
        data: appData,
      },
      ILPeak_Events: {
        collections: eventsCollections.map((c) => c.name),
        data: eventsData,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
