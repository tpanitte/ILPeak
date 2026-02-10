// src/features/ILPrograms/actions.ts

"use server";

import { mockAuth } from "@/lib/mock-auth";
// 1. Import your Domain Service
import { ILProgramsService } from "@/domain/ILPrograms/service"; 
// 2. Import your Event Builder
import { createILPrograms } from "@/domain/ILPrograms/Events/ILProgramsCreated";
// 3. Local Schema (ViewModel)
import { ProgramSession } from "./schema"; 

export async function createProgramAction(props: {
  name: string;
  semester: string;
  classroomDay: string;
  sessions: ProgramSession[];
}) {
  const { userId } = await mockAuth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const traceId = crypto.randomUUID();

  // --- 1. Logic: Transform UI Data to Domain Payloads ---
  
  // Parse "ILP68" -> 68
  const serieNumber = parseInt(props.name.replace(/\D/g, '')) || 0;

  // Find Pre-Class
  const preClassSession = props.sessions.find(s => s.type === 'PRE_CLASS');
  if (!preClassSession) throw new Error("Schedule is missing Pre-Class session");

  // Helper to extract dates
  const getDates = (prefix: string) => 
    props.sessions.filter(s => s.name.startsWith(prefix)).map(s => s.date);

  // --- 2. Build Event ---
  // We generate the Aggregate ID here so we can return it to the UI
  const aggregateID = crypto.randomUUID();

  const event = createILPrograms({
    aggregateID, // Overrides the default random ID in your builder
    _version: 0,
    _createdBy: userId,
    
    // Match 'payloads' strict interface
    payloads: {
      serie: serieNumber, 
      classroomDay: props.classroomDay,
      
      preclassroom: [preClassSession.date], 
      
      weekend1Date: getDates("Weekend 1"),
      weekend2Date: getDates("Weekend 2"),
      weekend3Date: getDates("Weekend 3"),
      weekend4Date: getDates("Weekend 4"),
      
      classrooms: props.sessions
        .filter(s => s.type === 'CLASSROOM')
        .map(s => s.date),
    },
    
    _metadata: { 
      traceId
    }
  });

  // --- 3. Dispatch via Service ---
  await ILProgramsService.dispatch(event);

  return { success: true, programId: aggregateID };
}
