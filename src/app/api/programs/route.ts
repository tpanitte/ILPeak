import { NextResponse } from "next/server";
import { connectAppDatabase } from "@/infra/db/mongodb";

export async function GET() {
  try {
    const db = await connectAppDatabase();
    const programs = await db
      .collection("programs_view")
      .find({})
      .sort({ serie: -1 })
      .toArray();

    const result = programs.map((p) => ({
      _id: p._id.toString(),
      name: p.name ?? `ILP ${p.serie}`,
      serie: p.serie,
    }));

    return NextResponse.json(result);
  } catch {
    // Return empty array if DB is unavailable (mock mode)
    return NextResponse.json([]);
  }
}
