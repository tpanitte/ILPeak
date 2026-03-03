// src/domain/Coaches/Events/GroupCreated.ts

import { EventBuilder, IEvent } from "atomservices";

export const EventName = "GroupCreated";

// Event: Group Created
export interface IGroupCreatedPayloads {
  programID: string;
  name: string;
  coachLeaderID: string;
}

export interface IGroupCreatedEvent extends IEvent<IGroupCreatedPayloads> { }

export const createGroup = EventBuilder<IGroupCreatedEvent>({
  EventName,
  AggregateType: "Coaches",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
