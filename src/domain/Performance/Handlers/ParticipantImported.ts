// src/domain/Performance/Handlers/ParticipantImported.ts

import { IEventHandler } from "atomservices";
import { IParticipantImportedEvent } from "../Events/ParticipantImported";
import { connectAppDatabase } from "@/infra/db/mongodb";

export const ParticipantImportedHandler: IEventHandler<IParticipantImportedEvent> = {
  name: "ParticipantImported",
  handle: async (event: IParticipantImportedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection("participants_view");

    const p = event.payloads;

    const data = {
      _id: event.aggregateID,
      ppID: p.ppID,
      name: p.name,
      mobile: p.mobile ?? "",
      coachID: p.coachID,
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
