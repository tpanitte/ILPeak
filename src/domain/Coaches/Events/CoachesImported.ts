// src/domain/Coaches/Events/CoachesImported.ts

import { EventBuilder, IEvent } from "atomservices";

export const EventName = "CoachesImported";

// Event: Coaches Imported
export interface ICoachesImportedPayloads {
  coachID: string;
  name: string;
  email: string;
  programID: string;
  mobile?: string;
}

export interface ICoachesImportedEvent extends IEvent<ICoachesImportedPayloads> { }

export const importCoaches = EventBuilder<ICoachesImportedEvent>({
  EventName,
  AggregateType: "Coaches",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
