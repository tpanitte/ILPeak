"use server";

import { mockAuth } from "@/lib/mock-auth";
import { PerformanceService } from "@/domain/Performance/service";
import { createCoachGroup } from "@/domain/Performance/Events/CoachGroupCreated";

export async function createCoachGroupAction(name: string, leaderCoachID: string) {
  const { userId } = await mockAuth();
  if (!userId) throw new Error("Unauthorized");

  const event = createCoachGroup({
    _version: 0,
    _createdBy: userId,
    payloads: {
      name,
      leaderCoachID,
    },
  });

  await PerformanceService.dispatch(event);

  return { success: true, groupId: event.aggregateID };
}
