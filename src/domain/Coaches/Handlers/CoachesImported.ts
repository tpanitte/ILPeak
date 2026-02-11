// src/domain/Coaches/Handlers/CoachesImported.ts

import { IEventHandler } from "atomservices";
import { EventName, ICoachesImportedEvent } from "../Events/CoachesImported";
import { connectAppDatabase } from "@/infra/db/mongodb";

export const CoachesImportedHandler: IEventHandler<ICoachesImportedEvent> = {
  name: EventName,
  handle: async (event: ICoachesImportedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string; } & any>("coaches_view");

    const { coachID, name, email, programID, mobile } = event.payloads;

    const data = {
      _id: event.aggregateID,
      coachID,
      name,
      email,
      mobile,
      programID,
      _version: event._version,
      _updatedAt: new Date(),
      _updatedBy: event._createdBy
    };

    await collection.updateOne(
      { _id: event.aggregateID },
      { $set: data },
      { upsert: true }
    );
  },
};
