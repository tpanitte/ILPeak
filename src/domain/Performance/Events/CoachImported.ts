// src/domain/Performance/Events/CoachImported.ts

import { EventBuilder, IEvent } from "atomservices";

const EventName = "CoachImported";

export interface ICoachImportedEvent extends IEvent<{
  coachID: string;
  name: string;
  email: string;
}> {}

export const importCoach = EventBuilder<ICoachImportedEvent>({
  EventName,
  AggregateType: "Coaches",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
