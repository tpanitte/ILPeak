import { IEvent, createEventFactory } from "atomservices";

export interface ICoachGroupCreatedEvent extends IEvent<{
  name: string;
  leaderCoachID: string;
}> {}

export const createCoachGroup = createEventFactory<ICoachGroupCreatedEvent>("CoachGroupCreated");
