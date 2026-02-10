// src/domain/ILPrograms/Queries/getProgramsList.ts

import { connectAppDatabase } from "@/infra/db/mongodb";

// Define what the UI expects to see
export interface ProgramListItem {
  _id: string;
  serie: number;
  name: string;
  classroomDay: string;
  startDate: Date;
  endDate: Date;
  totalSessions: number;
  _version: number;
}

export async function getProgramsList(): Promise<ProgramListItem[]> {
  const db = await connectAppDatabase();
  
  const programs = await db
    .collection("programs_view")
    .find({})
    .sort({ serie: -1 })
    .toArray();

  return programs.map(p => ({
    _id: p._id.toString(),
    serie: p.serie,
    name: p.name,
    classroomDay: p.classroomDay,
    startDate: p.startDate,
    endDate: p.endDate,
    totalSessions: p.totalSessions,
    _version: p._version
  })) as ProgramListItem[];
}
