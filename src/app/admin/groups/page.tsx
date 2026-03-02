import { getCoachesList } from "@/domain/Performance/Queries/getCoachesList";
import { getCoachGroupsList } from "@/domain/Performance/Queries/getCoachGroupsList";
import { GroupsManager } from "@/features/CoachGroups/groups-manager";
import { AlertTriangle } from "lucide-react";

export default async function GroupsPage() {
  let coaches = [];
  let groups = [];
  let dbError = false;

  try {
    [coaches, groups] = await Promise.all([
      getCoachesList(),
      getCoachGroupsList(),
    ]);
  } catch (err) {
    console.error("Failed to load groups data:", err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Coach Groups
        </h1>
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <AlertTriangle className="size-5 shrink-0 text-[var(--warning)]" />
          <p className="text-sm text-muted-foreground">
            Unable to connect to the database. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return <GroupsManager initialCoaches={coaches} initialGroups={groups} />;
}
