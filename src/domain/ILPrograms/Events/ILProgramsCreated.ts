// src/domain/ILPrograms/Events/ILProgramsCreated.ts

import { EventBuilder, IEvent } from "atomservices";

const EventName = "ILProgramsCreated";

// Event: Program Created
export interface IILProgramsCreatedPayloads {
  serie: number;
  classroomDay: string;
  preclassroom: Date[];
  weekend1Date: Date[];
  weekend2Date: Date[];
  weekend3Date: Date[];
  weekend4Date: Date[];
  classrooms: Date[];
}

export interface IILProgramsCreatedEvent extends IEvent<IILProgramsCreatedPayloads> {}

export const createILPrograms = EventBuilder<IILProgramsCreatedEvent>({
  EventName,
  AggregateType: "ILPrograms",
  AggregateIdentifier: () => crypto.randomUUID(),
  EventIdentifier: () => crypto.randomUUID(),
});
