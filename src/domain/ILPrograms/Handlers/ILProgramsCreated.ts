// src/domain/ILPrograms/Handlers/ILProgramsCreated.ts

import { IEventHandler } from "atomservices";
import { IILProgramsCreatedEvent } from "../Events/ILProgramsCreated";
import { connectAppDatabase } from "@/infra/db/mongodb";

export const ILProgramsCreatedHandler: IEventHandler<IILProgramsCreatedEvent> = {
  name: "ILProgramsCreated",
  handle: async (event: IILProgramsCreatedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string; } & any>("programs_view");

    const p = event.payloads;

    // 1. Logic: Flatten all session dates to find the start and end
    const allDates = [
      ...p.preclassroom,
      ...p.weekend1Date,
      ...p.weekend2Date,
      ...p.weekend3Date,
      ...p.weekend4Date,
      ...p.classrooms
    ].map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

    // 2. Transform: Create the Read Model Document
    const data = {
      _id: event.aggregateID,
      serie: p.serie,
      name: `ILP ${p.serie}`,
      classroomDay: p.classroomDay,
      startDate: allDates[0],
      endDate: allDates[allDates.length - 1],
      totalSessions: allDates.length,
      schedule: {
        preclassroom: p.preclassroom,
        weekend1: p.weekend1Date,
        weekend2: p.weekend2Date,
        weekend3: p.weekend3Date,
        weekend4: p.weekend4Date,
        classrooms: p.classrooms
      },
      _version: event._version, //
      _updatedAt: new Date(),
      _updatedBy: event._createdBy //
    };

    // 3. Persist: Atomic Upsert to the App Database
    // We use aggregateID as the primary key for fast lookups
    await collection.updateOne(
      { _id: event.aggregateID },
      { $set: data },
      { upsert: true }
    );
  },
};
