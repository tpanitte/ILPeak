// src/domain/Coaches/service.ts

import { createService, InstantEventBus } from "atomservices";
import { MongoEventStore } from "@/infra/db/mongoes";

import {
  CoachesImportedHandler,
  GroupCreatedHandler,
  CoachToGroupAssignedHandler,
} from "./Handlers";

const EventStore = new MongoEventStore();

export const CoachesService = createService({
  EventStore,
  EventHandlers: [
    CoachesImportedHandler,
    GroupCreatedHandler,
    CoachToGroupAssignedHandler,
  ],
  EventBus: new InstantEventBus(),
});
