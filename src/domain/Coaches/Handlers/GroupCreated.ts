// src/domain/CoachGroups/Handlers/GroupCreated.ts

import { IEventHandler } from "atomservices";
import { connectAppDatabase } from "@/infra/db/mongodb";
import { EventName, IGroupCreatedEvent } from "../Events/GroupCreated";

export const GroupCreatedHandler: IEventHandler<IGroupCreatedEvent> = {
  name: EventName,
  handle: async (event: IGroupCreatedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string; } & any>("coach_groups_view");

    const { programID, name, coachLeaderID } = event.payloads;

    const data = {
      _id: event.aggregateID,
      programID,
      name,
      coachLeaderID,
      _version: event._version,
      _createdAt: event._createdAt,
      _createdBy: event._createdBy,
      _updatedAt: event._createdAt,
      _updatedBy: event._createdBy
    };

    await collection.updateOne(
      { _id: event.aggregateID },
      { $set: data },
      { upsert: true }
    );
  },
};
