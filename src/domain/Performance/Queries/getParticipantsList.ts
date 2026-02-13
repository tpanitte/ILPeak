import { connectAppDatabase } from "@/infra/db/mongodb";

export interface ParticipantListItem {
  _id: string;
  ppID: string;
  name: string;
  coachID: string;
  programId?: string;
}

export async function getParticipantsList(): Promise<ParticipantListItem[]> {
  const db = await connectAppDatabase();

  const participants = await db
    .collection("participants_view")
    .find({})
    .sort({ ppID: 1 })
    .toArray();

  return participants.map((p) => ({
    _id: p._id.toString(),
    ppID: p.ppID,
    name: p.name,
    coachID: p.coachID,
    programId: p.programId,
  })) as ParticipantListItem[];
}
