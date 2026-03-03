// src/domain/CoachGroups/Handlers/CoachToGroupAssigned.ts

import { IEventHandler } from "atomservices";
import { connectAppDatabase } from "@/infra/db/mongodb";
import { EventName, ICoachToGroupAssignedEvent } from "../Events/CoachToGroupAssigned";

export const CoachToGroupAssignedHandler: IEventHandler<ICoachToGroupAssignedEvent> = {
  name: EventName,
  handle: async (event: ICoachToGroupAssignedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string; } & any>("coach_groups_view");

    // Can you write update to add coachID to coaches array in coach_groups_view collection based on groupID and programID from event payloads?
    // const data = ....

    await collection.updateOne(
      { _id: event.aggregateID },
      { $set: data },
      { upsert: true }
    );
  },
};
