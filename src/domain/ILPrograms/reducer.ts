import { IReducer } from "atomservices";
import { IILProgramsCreatedEvent } from "./Events/ILProgramsCreated";

export interface ProgramState {
  serie: number;
  classroomDay: string;
  sessions: Date[];
}

export const initialState: ProgramState = {
  serie: 0,
  classroomDay: "",
  sessions: []
};

export const programReducer: IReducer<ProgramState> = (state, event) => {
  switch (event.name) {
    case "ILProgramsCreated": {
      const e = event as IILProgramsCreatedEvent;
      return {
        ...state,
        serie: e.payloads.serie,
        classroomDay: e.payloads.classroomDay,
        sessions: e.payloads.classrooms
      };
    }
    // Add future events here (e.g., ILProgramsRenamed, SessionAdded)
    default:
      return state;
  }
};
