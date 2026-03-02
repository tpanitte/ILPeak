import { connectAppDatabase } from "@/infra/db/mongodb";

export interface CoachGroupListItem {
  _id: string;
  name: string;
  leaderCoachID: string;
}

export async function getCoachGroupsList(): Promise<CoachGroupListItem[]> {
  const db = await connectAppDatabase();

  const groups = await db
    .collection("coach_groups_view")
    .find({})
    .sort({ _createdAt: 1 })
    .toArray();

  return groups.map((g) => ({
    _id: g._id.toString(),
    name: g.name,
    leaderCoachID: g.leaderCoachID,
  })) as CoachGroupListItem[];
}
