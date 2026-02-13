// src/domain/ILPrograms/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";
import { CoachImportedHandler, ParticipantImportedHandler } from "./Handlers";

const EventStore = new MongoEventStore();

export const PerformanceService = createService({
  EventStore,
  EventHandlers: [
    CoachImportedHandler,
    ParticipantImportedHandler,
  ],
  EventBus: new InstantEventBus(),
});
