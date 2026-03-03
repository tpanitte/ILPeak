// src/domain/Coaches/Handlers/CoachToGroupAssigned.ts

import { IEventHandler } from "atomservices";
import { connectAppDatabase } from "@/infra/db/mongodb";
import { EventName, ICoachToGroupAssignedEvent } from "../Events/CoachToGroupAssigned";

export const CoachToGroupAssignedHandler: IEventHandler<ICoachToGroupAssignedEvent> = {
  name: EventName,
  handle: async (event: ICoachToGroupAssignedEvent): Promise<void> => {
    const db = await connectAppDatabase();
    const collection = db.collection<{ _id: string } & Record<string, unknown>>("coach_groups_view");

    const { coachID, groupID } = event.payloads;

    await collection.updateOne(
      { _id: groupID },
      { $addToSet: { coaches: coachID } }
    );
  },
};
