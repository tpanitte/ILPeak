"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  UsersRound,
  Search,
  UserCheck,
  Crown,
  UserPlus,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { CoachListItem } from "@/domain/Performance/Queries/getCoachesList";
import type { CoachGroupListItem } from "@/domain/Performance/Queries/getCoachGroupsList";
import { createCoachGroupAction } from "./actions";

interface Props {
  programId: string;
  initialCoaches: CoachListItem[];
  initialGroups: CoachGroupListItem[];
}

// Client-side assignment state: groupId -> coachID[]
type Assignments = Record<string, string[]>;

export function GroupsManager({
  programId,
  initialCoaches,
  initialGroups,
}: Props) {
  const [groups, setGroups] = useState<CoachGroupListItem[]>(initialGroups);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignGroupId, setAssignGroupId] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignSearch, setAssignSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const coaches = initialCoaches;

  // All assigned coach IDs across all groups (including leaders)
  const allAssignedIds = new Set<string>();
  groups.forEach((g) => {
    allAssignedIds.add(g.leaderCoachID);
    (assignments[g._id] ?? []).forEach((id) => allAssignedIds.add(id));
  });

  const unassignedCount = coaches.length - allAssignedIds.size;

  function getCoach(coachID: string) {
    return coaches.find((c) => c.coachID === coachID);
  }

  function getCoachName(coachID: string) {
    return getCoach(coachID)?.name ?? coachID;
  }

  function getMembersForGroup(groupId: string) {
    const group = groups.find((g) => g._id === groupId);
    if (!group) return [];
    const memberIds = assignments[groupId] ?? [];
    return [group.leaderCoachID, ...memberIds];
  }

  function toggleExpand(groupId: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  // Coaches available for assignment to a specific group (not assigned to any group)
  function getAvailableCoaches() {
    return coaches.filter((c) => !allAssignedIds.has(c.coachID));
  }

  function handleOpenAssign(groupId: string) {
    setAssignGroupId(groupId);
    setAssignSearch("");
    setAssignOpen(true);
  }

  function handleAssignCoach(coachID: string) {
    setAssignments((prev) => ({
      ...prev,
      [assignGroupId]: [...(prev[assignGroupId] ?? []), coachID],
    }));
    setAssignOpen(false);
  }

  function handleUnassignCoach(groupId: string, coachID: string) {
    setAssignments((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] ?? []).filter((id) => id !== coachID),
    }));
  }

  // Create group
  const filteredCreateCoaches = coaches.filter(
    (c) =>
      c.coachID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleCreate() {
    if (!newGroupName.trim() || !selectedLeader) return;
    startTransition(async () => {
      try {
        const result = await createCoachGroupAction(
          programId,
          newGroupName.trim(),
          selectedLeader
        );
        if (result.success) {
          setGroups([
            ...groups,
            {
              _id: result.groupId,
              name: newGroupName.trim(),
              leaderCoachID: selectedLeader,
            },
          ]);
          setCreateOpen(false);
          setNewGroupName("");
          setSelectedLeader("");
          setSearchQuery("");
        }
      } catch (err) {
        console.error("Failed to create group:", err);
      }
    });
  }

  // Assign dialog: available coaches filtered
  const availableCoaches = getAvailableCoaches();
  const filteredAssignCoaches = availableCoaches.filter(
    (c) =>
      c.coachID.toLowerCase().includes(assignSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(assignSearch.toLowerCase())
  );

  const assignGroupName =
    groups.find((g) => g._id === assignGroupId)?.name ?? "";

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Coach Groups
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create groups, assign a leader, then add coaches one at a time.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create Group
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Badge variant="secondary">
          <UsersRound className="mr-1 size-3" />
          {coaches.length} Coaches
        </Badge>
        <Badge variant="secondary">{groups.length} Groups</Badge>
        <Badge variant="outline">{unassignedCount} Unassigned</Badge>
      </div>

      {/* Groups */}
      {groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map((g) => {
            const memberIds = assignments[g._id] ?? [];
            const totalMembers = 1 + memberIds.length; // leader + assigned
            const isExpanded = expandedGroups.has(g._id);

            return (
              <Card key={g._id}>
                {/* Group header row */}
                <button
                  type="button"
                  onClick={() => toggleExpand(g._id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/30"
                >
                  {isExpanded ? (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <UsersRound className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {g.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <Crown className="mb-0.5 mr-1 inline size-3 text-amber-500" />
                      {getCoachName(g.leaderCoachID)}
                      <span className="mx-2 text-border">|</span>
                      {totalMembers} member{totalMembers !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAssign(g._id);
                    }}
                  >
                    <UserPlus className="mr-1.5 size-3.5" />
                    Assign
                  </Button>
                </button>

                {/* Expanded members list */}
                {isExpanded && (
                  <div className="border-t border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-[10px] font-bold uppercase tracking-widest">
                            #
                          </TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            Coach ID
                          </TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            Name
                          </TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            Email
                          </TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                            Role
                          </TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Leader row */}
                        {(() => {
                          const coach = getCoach(g.leaderCoachID);
                          return (
                            <TableRow className="bg-amber-50/50">
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                1
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {g.leaderCoachID}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {coach?.name ?? g.leaderCoachID}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {coach?.email || "[Empty]"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="bg-amber-100 text-amber-700"
                                >
                                  <Crown className="mr-1 size-3" />
                                  Leader
                                </Badge>
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          );
                        })()}

                        {/* Assigned coaches */}
                        {memberIds.map((coachID, i) => {
                          const coach = getCoach(coachID);
                          return (
                            <TableRow key={coachID}>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {i + 2}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {coachID}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {coach?.name ?? coachID}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {coach?.email || "[Empty]"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">Member</Badge>
                              </TableCell>
                              <TableCell>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUnassignCoach(g._id, coachID)
                                  }
                                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                  title="Remove from group"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        {/* Empty state for no assigned members */}
                        {memberIds.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="py-6 text-center text-sm text-muted-foreground"
                            >
                              No coaches assigned yet. Click "Assign" to add
                              coaches.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <UsersRound className="mb-4 size-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              No groups yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Create Group" to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ---- Create Group Dialog ---- */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Coach Group</DialogTitle>
            <DialogDescription>
              Enter a group name and select a coach to be the group leader.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Group Name
              </label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Alpha Team"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Coach Leader
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or name..."
                  className="pl-9"
                />
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                {filteredCreateCoaches.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    {coaches.length === 0
                      ? "No coaches imported yet."
                      : "No coaches match your search."}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredCreateCoaches.map((coach) => {
                      const isSelected =
                        selectedLeader === coach.coachID;
                      return (
                        <button
                          key={coach.coachID}
                          type="button"
                          onClick={() =>
                            setSelectedLeader(coach.coachID)
                          }
                          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                            isSelected
                              ? "bg-primary/10"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {coach.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {coach.name}
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground">
                              {coach.coachID}
                            </p>
                          </div>
                          {isSelected && (
                            <UserCheck className="size-4 shrink-0 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedLeader && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected:{" "}
                  <span className="font-medium text-foreground">
                    {getCoachName(selectedLeader)}
                  </span>{" "}
                  <span className="font-mono">({selectedLeader})</span>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  setNewGroupName("");
                  setSelectedLeader("");
                  setSearchQuery("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  !newGroupName.trim() || !selectedLeader || isPending
                }
              >
                {isPending ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- Assign Coach Dialog ---- */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Coach to {assignGroupName}
            </DialogTitle>
            <DialogDescription>
              Select a coach to add to this group. Only unassigned coaches
              are shown.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder="Search by ID or name..."
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              {filteredAssignCoaches.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {availableCoaches.length === 0
                    ? "All coaches are assigned to groups."
                    : "No coaches match your search."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredAssignCoaches.map((coach) => (
                    <button
                      key={coach.coachID}
                      type="button"
                      onClick={() => handleAssignCoach(coach.coachID)}
                      className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-primary/5"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {coach.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {coach.name}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {coach.coachID}
                          {coach.email && (
                            <span className="ml-2 font-sans">
                              {coach.email}
                            </span>
                          )}
                        </p>
                      </div>
                      <UserPlus className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {availableCoaches.length} coach
              {availableCoaches.length !== 1 ? "es" : ""} available
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
