// src/domain/Participants/Events/ParticipantsImported.ts

import { EventBuilder, IEvent } from "atomservices";

export const EventName = "ParticipantsImported";

// Event: Participants Imported
export interface IParticipantsImportedPayloads {
  participantID: string;
  name: string;
  programID: string;
  coachID: string;
}

export interface IParticipantsImportedEvent extends IEvent<IParticipantsImportedPayloads> { }

export const importParticipants = EventBuilder<IParticipantsImportedEvent>({
  EventName,
  AggregateType: "Participants",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
