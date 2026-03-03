// src/domain/Performance/service.ts
// Only handles Performance-specific events (e.g. ProgramGoalsSet)

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

const EventStore = new MongoEventStore();

export const PerformanceService = createService({
  EventStore,
  EventHandlers: [
    // ProgramGoalsSetHandler -- add when implemented
  ],
  EventBus: new InstantEventBus(),
});
