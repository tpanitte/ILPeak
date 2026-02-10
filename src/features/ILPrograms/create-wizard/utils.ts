// src/features/programs/create-wizard/utils.ts

import { addDays, getDay } from "date-fns";
import { ConfigFormData } from "./Step1Config";
import { ProgramSession } from "../schema";

export function generateProposedSchedule(config: ConfigFormData): ProgramSession[] {
  const sessions: ProgramSession[] = [];
  
  // --- Helper ---
  const add = (date: Date, type: 'PRE_CLASS' | 'WEEKEND' | 'CLASSROOM', name: string, index?: number) => {
    sessions.push({
      id: crypto.randomUUID(),
      date: date,
      type,
      name,
      index
    });
  };

  // --- 1. Fixed Anchors ---
  add(config.preClassDate, 'PRE_CLASS', 'Pre-Class Orientation');

  // Weekend 1 (Fri-Sun)
  add(config.weekend1Date, 'WEEKEND', 'Weekend 1 (Day 1 - Fri)');
  add(addDays(config.weekend1Date, 1), 'WEEKEND', 'Weekend 1 (Day 2 - Sat)');
  add(addDays(config.weekend1Date, 2), 'WEEKEND', 'Weekend 1 (Day 3 - Sun)');

  // Weekend 2 (Sat-Sun)
  add(config.weekend2Date, 'WEEKEND', 'Weekend 2 (Day 1 - Sat)');
  add(addDays(config.weekend2Date, 1), 'WEEKEND', 'Weekend 2 (Day 2 - Sun)');

  // Weekend 3 (Sat-Sun)
  add(config.weekend3Date, 'WEEKEND', 'Weekend 3 (Day 1 - Sat)');
  add(addDays(config.weekend3Date, 1), 'WEEKEND', 'Weekend 3 (Day 2 - Sun)');

  // Weekend 4 (Sat-Sun)
  add(config.weekend4Date, 'WEEKEND', 'Weekend 4 (Day 1 - Sat)');
  add(addDays(config.weekend4Date, 1), 'WEEKEND', 'Weekend 4 (Day 2 - Sun)');

  // --- 2. Classroom Generation ---
  // CORRECTION: Start looking for slots AFTER Weekend 1 finishes.
  // Weekend 1 is 3 days (Index 0,1,2), so we start checking from Day 3 (Monday).
  let currentDate = addDays(config.weekend1Date, 3);
  
  const targetDay = parseInt(config.classroomDay, 10);
  const occupiedDates = new Set(sessions.map(s => s.date.toDateString()));
  let count = 1;

  while (count <= config.totalClassrooms) {
    const dayOfWeek = getDay(currentDate);
    const dateStr = currentDate.toDateString();

    // Logic: Must be correct day AND not overlapping an existing Weekend
    if (dayOfWeek === targetDay && !occupiedDates.has(dateStr)) {
      add(currentDate, 'CLASSROOM', `Classroom ${count}`, count);
      count++;
    }

    currentDate = addDays(currentDate, 1);
    if (count > 100) break; // Safety
  }

  return sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
}
