// src/domain/Performance/Events/ParticipantImported.ts

import { EventBuilder, IEvent } from "atomservices";

const EventName = "ParticipantImported";

export interface IParticipantImportedEvent extends IEvent<{
  ppID: string;
  name: string;
  mobile: string;
  coachID: string; // The link to the Coach
}> { }

export const importParticipant = EventBuilder<IParticipantImportedEvent>({
  EventName,
  AggregateType: "Participants",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
