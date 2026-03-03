"use server";

import { mockAuth } from "@/lib/mock-auth";
import { CoachesService } from "@/domain/CoachGroups/service";
import { createGroup } from "@/domain/CoachGroups/Events/GroupCreated";

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
