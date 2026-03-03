// src/domain/Coaches/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

import {
  CoachesImportedHandler,
  GroupCreatedHandler,
} from "./Handlers";

const EventStore = new MongoEventStore();

export const CoachesService = createService({
  EventStore,
  EventHandlers: [
    CoachesImportedHandler,
    GroupCreatedHandler,
  ],
  EventBus: new InstantEventBus(),
});
