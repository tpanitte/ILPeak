export interface ProgramSession {
  id: string; // Temporary UUID for UI keys
  date: Date;
  type: "PRE_CLASS" | "WEEKEND" | "CLASSROOM";
  name: string;
  index?: number;
}

export interface ILProgram {
  _id: string;
  title: string;
  description: string;
  serie: number;
  preclassroom: Date[];
  weekend1Date: Date[];
  weekend2Date: Date[];
  weekend3Date: Date[];
  weekend4Date: Date[];
  classrooms: Date[];
  _createdAt: Date;
  _updatedAt: Date;
}
