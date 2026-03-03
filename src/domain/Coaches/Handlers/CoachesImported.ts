// src/domain/Coaches/Handlers/CoachesImported.ts

import { IEventHandler } from "atomservices";
import { EventName, ICoachesImportedEvent } from "../Events/CoachesImported";
import { connectAppDatabase } from "@/infra/db/mongodb";

interface ICoachesState {
  _id: string;
  coachID: string;
  name: string;
  email: string;
  mobile: string;
  programID: string;
  _version: number;
  _createdAt: Date;
  _createdBy: string;
  _updatedAt: Date;
  _updatedBy: string;
}

export const CoachesImportedHandler: IEventHandler<ICoachesImportedEvent> = {
  name: EventName,
  handle: async (event: ICoachesImportedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string; } & ICoachesState>("coaches_view");

    const { coachID, name, email, programID, mobile } = event.payloads;
    const { _createdAt, _createdBy } = event;

    const data = {
      _id: event.aggregateID,
      coachID,
      name,
      email,
      mobile,
      programID,
      _version: event._version,
      _createdAt,
      _createdBy,
      _updatedAt: _createdAt,
      _updatedBy: _createdBy
    };

    await collection.updateOne(
      { _id: event.aggregateID },
      { $set: data },
      { upsert: true }
    );
  },
};
