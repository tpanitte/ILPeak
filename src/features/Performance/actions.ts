"use server";

import { auth } from "@clerk/nextjs/server";
import { isAfter } from "date-fns";
import { PerformanceService } from "@/domain/Performance/service";
import { setProgramGoals } from "@/domain/Performance/Events/ProgramGoalsSet";
import { connectAppDatabase } from "@/infra/db/mongodb";

export async function updateParticipantGoalAction(props: {
  programID: string;
  ppID: string;
  weekendIndex: 1 | 2 | 3 | 4;
  guests: number;
  registered: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Fetch the Program Schedule from the Read Model
  const db = await connectAppDatabase();
  const program = await db.collection("ILPrograms").findOne({ _id: props.programID });
  if (!program) throw new Error("Program not found");

  // 2. Determine the lock date for the specific weekend
  // Logic: We lock the goal if the current date is after the first day of that weekend block
  const weekendDates = program.schedule[`weekend${props.weekendIndex}`] as Date[];
  const lockDate = new Date(weekendDates[0]); 

  if (isAfter(new Date(), lockDate)) {
    throw new Error(`Weekend #${props.weekendIndex} has already started/passed. Goals are locked.`);
  }

  // 3. Dispatch the event if valid
  const event = setProgramGoals({
    _version: 0,
    _createdBy: userId,
    payloads: {
      ppID: props.ppID,
      programID: props.programID,
      weekendIndex: props.weekendIndex,
      cumulativeGuests: props.guests,
      cumulativeRegistered: props.registered,
    },
    _metadata: {},
  });

  await PerformanceService.dispatch(event);

  return { success: true };
}
