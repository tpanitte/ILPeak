// src/domain/Coaches/Events/CoachToGroupAssigned.ts

import { EventBuilder, IEvent } from "atomservices";

export const EventName = "CoachToGroupAssigned";

// Event: Coach To Group Assigned
export interface ICoachToGroupAssignedPayloads {
  programID: string;
  coachID: string;
  groupID: string;
}

export interface ICoachToGroupAssignedEvent extends IEvent<ICoachToGroupAssignedPayloads> { }

export const assignCoachToGroup = EventBuilder<ICoachToGroupAssignedEvent>({
  EventName,
  AggregateType: "Coaches",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
