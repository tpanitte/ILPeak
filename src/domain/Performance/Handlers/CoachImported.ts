// src/domain/Performance/Handlers/CoachImported.ts

import { IEventHandler } from "atomservices";
import { ICoachImportedEvent } from "../Events/CoachImported";
import { connectAppDatabase } from "@/infra/db/mongodb";

export const CoachImportedHandler: IEventHandler<ICoachImportedEvent> = {
  name: "CoachImported",
  handle: async (event: ICoachImportedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection("coaches_view");

    const p = event.payloads;

    const data = {
      _id: event.aggregateID,
      coachID: p.coachID,
      name: p.name,
      email: p.email,
      programId: event._metadata?.programId,
      _version: event._version,
      _updatedAt: new Date(),
      _updatedBy: event._createdBy,
    };

    await collection.updateOne(
      { _id: event.aggregateID },
      { $set: data },
      { upsert: true }
    );
  },
};
