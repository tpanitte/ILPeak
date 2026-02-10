// src/features/ILPrograms/create-wizard/debug.ts

import { ConfigFormData } from "./Step1Config";
import { ProgramSession } from "../schema";

// 1. Config matching the image structure (Thursday Classrooms)
export const DEBUG_CONFIG: ConfigFormData = {
  name: "ILP 68 (Test)",
  classroomDay: "4", // Thursday
  totalClassrooms: 20,
  // Anchors based on Image
  preClassDate: new Date("2026-02-27T12:00:00"),
  weekend1Date: new Date("2026-03-06T12:00:00"),
  weekend2Date: new Date("2026-04-25T12:00:00"),
  weekend3Date: new Date("2026-06-13T12:00:00"),
  weekend4Date: new Date("2026-08-01T12:00:00"),
};

// 2. Pre-filled Sessions (Exact Match to Image)
export function getDebugSessions(): ProgramSession[] {
  const sessions: ProgramSession[] = [];
  
  // Helper to construct session objects
  const add = (dateStr: string, type: 'PRE_CLASS' | 'WEEKEND' | 'CLASSROOM', name: string, index?: number) => {
    sessions.push({
      id: crypto.randomUUID(),
      date: new Date(dateStr + "T12:00:00"), // Set noon to avoid timezone shifts
      type,
      name,
      index
    });
  };

  // --- PRE-CLASS ---
  add("2026-02-27", 'PRE_CLASS', 'Pre-Class Orientation');

  // --- WEEKEND 1 ---
  add("2026-03-06", 'WEEKEND', 'Weekend 1 (Day 1 - Fri)');
  add("2026-03-07", 'WEEKEND', 'Weekend 1 (Day 2 - Sat)');
  add("2026-03-08", 'WEEKEND', 'Weekend 1 (Day 3 - Sun)');

  // --- BLOCK 1 (Classrooms 1-5) ---
  add("2026-03-12", 'CLASSROOM', 'Classroom 1', 1);
  add("2026-03-19", 'CLASSROOM', 'Classroom 2', 2);
  add("2026-03-26", 'CLASSROOM', 'Classroom 3', 3);
  add("2026-04-02", 'CLASSROOM', 'Classroom 4', 4);
  add("2026-04-09", 'CLASSROOM', 'Classroom 5', 5);
  // Note: Apr 16 (Songkran?) skipped per image

  // --- WEEKEND 2 ---
  add("2026-04-25", 'WEEKEND', 'Weekend 2 (Day 1 - Sat)');
  add("2026-04-26", 'WEEKEND', 'Weekend 2 (Day 2 - Sun)');

  // --- BLOCK 2 (Classrooms 6-9) ---
  add("2026-04-30", 'CLASSROOM', 'Classroom 6', 6);
  // Note: May 7 skipped per image
  add("2026-05-14", 'CLASSROOM', 'Classroom 7', 7);
  add("2026-05-21", 'CLASSROOM', 'Classroom 8', 8);
  // Note: May 28 skipped per image
  add("2026-06-04", 'CLASSROOM', 'Classroom 9', 9);

  // --- WEEKEND 3 ---
  add("2026-06-13", 'WEEKEND', 'Weekend 3 (Day 1 - Sat)');
  add("2026-06-14", 'WEEKEND', 'Weekend 3 (Day 2 - Sun)');

  // --- BLOCK 3 (Classrooms 10-14) ---
  add("2026-06-25", 'CLASSROOM', 'Classroom 10', 10);
  add("2026-07-02", 'CLASSROOM', 'Classroom 11', 11);
  add("2026-07-09", 'CLASSROOM', 'Classroom 12', 12);
  add("2026-07-16", 'CLASSROOM', 'Classroom 13', 13);
  add("2026-07-23", 'CLASSROOM', 'Classroom 14', 14);

  // --- WEEKEND 4 ---
  add("2026-08-01", 'WEEKEND', 'Weekend 4 (Day 1 - Sat)');
  add("2026-08-02", 'WEEKEND', 'Weekend 4 (Day 2 - Sun)');

  // --- BLOCK 4 (Classrooms 15-20) ---
  // Note: Aug 6 skipped
  add("2026-08-13", 'CLASSROOM', 'Classroom 15', 15);
  add("2026-08-20", 'CLASSROOM', 'Classroom 16', 16);
  add("2026-08-27", 'CLASSROOM', 'Classroom 17', 17);
  add("2026-09-03", 'CLASSROOM', 'Classroom 18', 18);
  add("2026-09-10", 'CLASSROOM', 'Classroom 19', 19);
  add("2026-09-17", 'CLASSROOM', 'Classroom 20', 20);

  return sessions;
}
