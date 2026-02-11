// src/domain/Coaches/Handlers/CoachesImported.ts

import { IEventHandler } from "atomservices";
import { EventName, IParticipantsImportedEvent } from "../Events/ParticipantsImported";
import { connectAppDatabase } from "@/infra/db/mongodb";

export const ParticipantsImportedHandler: IEventHandler<IParticipantsImportedEvent> = {
  name: EventName,
  handle: async (event: IParticipantsImportedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string; } & any>("participants_view");

    const { participantID, name, programID, coachID } = event.payloads;

    const data = {
      _id: event.aggregateID,
      participantID,
      name,
      programID,
      coachID,
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
