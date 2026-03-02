// src/domain/ILPrograms/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

import { GroupCreatedHandler } from "./Handlers";

const EventStore = new MongoEventStore();

export const CoachesService = createService({
  EventStore,
  EventHandlers: [
    GroupCreatedHandler,
  ],
  EventBus: new InstantEventBus(),
});
