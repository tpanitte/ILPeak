"use server";

import { mockAuth } from "@/lib/mock-auth";
import { CoachesService } from "@/domain/Coaches/service";
import { ParticipantsService } from "@/domain/Participants/service";
import { importCoaches } from "@/domain/Coaches/Events/CoachesImported";
import { importParticipants } from "@/domain/Participants/Events/ParticipantsImported";

export interface ImportCoachRow {
  coachID: string;
  name: string;
  email: string;
  mobile: string;
}

export interface ImportParticipantRow {
  participantID: string;
  nName: string;
  fName: string;
  mobile: string;
  coachID: string;
}

/**
 * Import a single coach row as one CoachesImported event.
 * Called once per CSV row from the UI.
 */
export async function importCoachAction(
  programId: string,
  row: ImportCoachRow
) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = importCoaches({
    _version: 0,
    _createdBy: userId,
    payloads: {
      coachID: row.coachID,
      name: row.name,
      email: row.email,
      mobile: row.mobile,
      programID: programId,
    },
  });

  await CoachesService.dispatch(event);

  return { success: true, coachID: row.coachID };
}

/**
 * Import a single participant row as one ParticipantsImported event.
 * Called once per CSV row from the UI.
 */
export async function importParticipantAction(
  programId: string,
  row: ImportParticipantRow
) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = importParticipants({
    _version: 0,
    _createdBy: userId,
    payloads: {
      participantID: row.participantID,
      nName: row.nName,
      fName: row.fName,
      coachID: row.coachID,
      programID: programId,
    },
  });

  await ParticipantsService.dispatch(event);

  return { success: true, participantID: row.participantID };
}
