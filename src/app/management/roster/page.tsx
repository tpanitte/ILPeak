import { getCoachesList } from "@/domain/Performance/Queries/getCoachesList";
import { getParticipantsList } from "@/domain/Performance/Queries/getParticipantsList";
import { RosterTable } from "@/features/Management/roster-table";
import { AlertTriangle } from "lucide-react";

export default async function RosterPage() {
  let coaches;
  let participants;
  let dbError = false;

  try {
    [coaches, participants] = await Promise.all([
      getCoachesList(),
      getParticipantsList(),
    ]);
  } catch {
    dbError = true;
    coaches = [];
    participants = [];
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Coaches & Participants
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all coaches and participants. Click a coach name to reassign a
          participant.
        </p>
      </div>

      {dbError && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          Could not connect to the database. Showing empty state.
        </div>
      )}

      <RosterTable coaches={coaches} participants={participants} />
    </div>
  );
}
