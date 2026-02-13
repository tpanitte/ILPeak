import { connectAppDatabase } from "@/infra/db/mongodb";

export interface CoachListItem {
  _id: string;
  coachID: string;
  name: string;
  email: string;
  programId?: string;
}

export async function getCoachesList(): Promise<CoachListItem[]> {
  const db = await connectAppDatabase();

  const coaches = await db
    .collection("coaches_view")
    .find({})
    .sort({ coachID: 1 })
    .toArray();

  return coaches.map((c) => ({
    _id: c._id.toString(),
    coachID: c.coachID,
    name: c.name,
    email: c.email,
    programId: c.programId,
  })) as CoachListItem[];
}
