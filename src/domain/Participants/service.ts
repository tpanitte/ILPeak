// src/domain/ILPrograms/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

import { ParticipantsImportedHandler } from "./Handlers"; // Import event handlers when available

const EventStore = new MongoEventStore();

export const ParticipantsService = createService({
  EventStore,
  EventHandlers: [
    ParticipantsImportedHandler,
  ],
  EventBus: new InstantEventBus(),
});
