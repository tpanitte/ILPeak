// src/domain/ILPrograms/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

import { CoachesImportedHandler } from "./Handlers"; // Import event handlers when available

const EventStore = new MongoEventStore();

export const CoachesService = createService({
  EventStore,
  EventHandlers: [
    CoachesImportedHandler,
  ],
  EventBus: new InstantEventBus(),
});
