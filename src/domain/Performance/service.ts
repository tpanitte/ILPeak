// src/domain/ILPrograms/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

// import { ILProgramsCreatedHandler } from "./Handlers"; // Import event handlers when available

const EventStore = new MongoEventStore();

export const PerformanceService = createService({
  EventStore,
  EventHandlers: [
    // ILProgramsCreatedHandler,
  ],
  EventBus: new InstantEventBus(),
});
