"use server";

import { mockAuth } from "@/lib/mock-auth";
import { PerformanceService } from "@/domain/Performance/service";
import { importCoach } from "@/domain/Performance/Events/CoachImported";
import { importParticipant } from "@/domain/Performance/Events/ParticipantImported";

export interface ImportCoachRow {
  coachID: string;
  name: string;
  email: string;
}

export interface ImportParticipantRow {
  ppID: string;
  name: string;
  mobile: string;
  coachID: string;
}

/**
 * Import a single coach row as one CoachImported event.
 * Called once per CSV row from the UI.
 */
export async function importCoachAction(
  programId: string,
  row: ImportCoachRow
) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = importCoach({
    _version: 0,
    _createdBy: userId,
    payloads: {
      coachID: row.coachID,
      name: row.name,
      email: row.email,
    },
    _metadata: {
      programId,
    },
  });

  await PerformanceService.dispatch(event);

  return { success: true, coachID: row.coachID };
}

/**
 * Import a single participant row as one ParticipantImported event.
 * Called once per CSV row from the UI.
 */
export async function importParticipantAction(
  programId: string,
  row: ImportParticipantRow
) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = importParticipant({
    _version: 0,
    _createdBy: userId,
    payloads: {
      ppID: row.ppID,
      name: row.name,
      mobile: row.mobile,
      coachID: row.coachID,
    },
    _metadata: {
      programId,
    },
  });

  await PerformanceService.dispatch(event);

  return { success: true, ppID: row.ppID };
}
