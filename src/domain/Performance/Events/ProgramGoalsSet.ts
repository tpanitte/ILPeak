// src/domain/Performance/Events/ParticipantImported.ts

import { EventBuilder, IEvent } from "atomservices";

const EventName = "ProgramGoalsSet";

export interface IProgramGoalsSetEvent extends IEvent<{
  ppID: string;
  programID: string;
  weekendIndex: 1 | 2 | 3 | 4;
  cumulativeGuests: number;
  cumulativeRegistered: number;
}> { }

export const setProgramGoals = EventBuilder<IProgramGoalsSetEvent>({
  EventName,
  AggregateType: "Performance",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
