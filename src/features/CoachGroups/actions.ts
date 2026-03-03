"use server";

import { mockAuth } from "@/lib/mock-auth";
import { CoachesService } from "@/domain/Coaches/service";
import { createGroup } from "@/domain/Coaches/Events/GroupCreated";
import { assignCoachToGroup } from "@/domain/Coaches/Events/CoachToGroupAssigned";

export async function createCoachGroupAction(
  programId: string,
  name: string,
  coachLeaderID: string
) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = createGroup({
    _version: 0,
    _createdBy: userId,
    payloads: {
      programID: programId,
      name,
      coachLeaderID,
    },
  });

  await CoachesService.dispatch(event);

  return { success: true, groupId: event.aggregateID };
}

export async function assignCoachToGroupAction(
  programId: string,
  groupId: string,
  coachID: string
) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = assignCoachToGroup({
    _version: 0,
    _createdBy: userId,
    payloads: {
      programID: programId,
      coachID,
      groupID: groupId,
    },
  });

  await CoachesService.dispatch(event);

  return { success: true };
}
