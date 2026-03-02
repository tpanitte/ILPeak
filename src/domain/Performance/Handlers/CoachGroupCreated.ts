import { createEventHandler } from "atomservices";
import { connectAppDatabase } from "@/infra/db/mongodb";
import type { ICoachGroupCreatedEvent } from "../Events/CoachGroupCreated";

export const CoachGroupCreatedHandler = createEventHandler<ICoachGroupCreatedEvent>({
  eventType: "CoachGroupCreated",
  handler: async (event) => {
    const db = await connectAppDatabase();
    const collection = db.collection("coach_groups_view");

    const p = event.payloads;

    const data = {
      _id: event.aggregateID,
      name: p.name,
      leaderCoachID: p.leaderCoachID,
      _createdBy: event._createdBy,
      _createdAt: new Date(),
    };

    await collection.updateOne(
      { _id: data._id },
      { $set: data },
      { upsert: true }
    );
  },
});
