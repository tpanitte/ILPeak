"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Plus,
  Trash2,
  UsersRound,
  UserCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  COACHES,
  PARTICIPANTS,
  DEFAULT_GROUPS,
  getCoachPPs,
  type MockGroup,
} from "@/lib/mock-data";

export default function GroupsPage() {
  const [groups, setGroups] = useState<MockGroup[]>(DEFAULT_GROUPS);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("G1");
  const [newGroupName, setNewGroupName] = useState("");

  function addGroup() {
    if (!newGroupName.trim()) return;
    const id = `G${Date.now()}`;
    setGroups([
      ...groups,
      { id, name: newGroupName.trim(), leaderId: "", coachIds: [] },
    ]);
    setNewGroupName("");
    setExpandedGroup(id);
  }

  function removeGroup(id: string) {
    setGroups(groups.filter((g) => g.id !== id));
  }

  function toggleCoach(groupId: string, coachId: string) {
    setGroups(
      groups.map((g) => {
        if (g.id !== groupId) return g;
        const has = g.coachIds.includes(coachId);
        return {
          ...g,
          coachIds: has
            ? g.coachIds.filter((c) => c !== coachId)
            : [...g.coachIds, coachId],
        };
      })
    );
  }

  function setLeader(groupId: string, coachId: string) {
    setGroups(
      groups.map((g) =>
        g.id !== groupId ? g : { ...g, leaderId: coachId }
      )
    );
  }

  const assignedCoachIds = new Set(groups.flatMap((g) => g.coachIds));
  const unassignedCoaches = COACHES.filter(
    (c) => !assignedCoachIds.has(c.id)
  );
  const totalAssignedPPs = groups.reduce((sum, g) => {
    return (
      sum +
      g.coachIds.reduce((s, cid) => s + getCoachPPs(cid).length, 0)
    );
  }, 0);

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Group Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize {COACHES.length} Coaches and {PARTICIPANTS.length}{" "}
          Participants into groups. Each group has a Coach Group Leader.
        </p>
      </div>

      {/* Summary badges */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Badge variant="secondary">
          <UsersRound className="mr-1 size-3" />
          {COACHES.length} Coaches
        </Badge>
        <Badge variant="secondary">
          <UserCheck className="mr-1 size-3" />
          {PARTICIPANTS.length} Participants
        </Badge>
        <Badge variant="secondary">
          {groups.length} Group{groups.length !== 1 ? "s" : ""}
        </Badge>
        <Badge variant="secondary">
          {totalAssignedPPs}/{PARTICIPANTS.length} PPs in groups
        </Badge>
        {unassignedCoaches.length > 0 && (
          <Badge variant="secondary" className="bg-[var(--warning)]/10 text-[var(--warning)]">
            {unassignedCoaches.length} Unassigned Coach
            {unassignedCoaches.length !== 1 ? "es" : ""}
          </Badge>
        )}
      </div>

      {/* Create group */}
      <Card className="mb-6">
        <CardContent className="pt-0">
          <div className="flex items-center gap-3">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New group name..."
              className="max-w-xs"
              onKeyDown={(e) => e.key === "Enter" && addGroup()}
            />
            <Button onClick={addGroup} disabled={!newGroupName.trim()}>
              <Plus className="mr-2 size-4" />
              Add Group
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Groups list */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => {
          const isExpanded = expandedGroup === group.id;
          const groupCoaches = COACHES.filter((c) =>
            group.coachIds.includes(c.id)
          );
          const leader = COACHES.find((c) => c.id === group.leaderId);
          const groupPPs = PARTICIPANTS.filter((p) =>
            group.coachIds.includes(p.coachId)
          );

          return (
            <Card key={group.id}>
              <CardHeader
                className="cursor-pointer"
                onClick={() =>
                  setExpandedGroup(isExpanded ? null : group.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-base">
                        {group.name}
                      </CardTitle>
                      <CardDescription>
                        {groupCoaches.length} coach
                        {groupCoaches.length !== 1 ? "es" : ""},{" "}
                        {groupPPs.length} PP
                        {groupPPs.length !== 1 ? "s" : ""}
                        {leader && (
                          <span>
                            {" "}
                            &middot; Leader:{" "}
                            <span className="font-medium text-primary">
                              {leader.name}
                            </span>
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGroup(group.id);
                    }}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove group</span>
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  {/* Assign coaches -- compact chip grid for 20 coaches */}
                  <div className="mb-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Assign Coaches
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {COACHES.map((coach) => {
                        const isInGroup = group.coachIds.includes(
                          coach.id
                        );
                        const isInOther =
                          !isInGroup && assignedCoachIds.has(coach.id);
                        return (
                          <button
                            key={coach.id}
                            onClick={() =>
                              !isInOther &&
                              toggleCoach(group.id, coach.id)
                            }
                            disabled={isInOther}
                            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                              isInGroup
                                ? "border-primary bg-primary/10 text-primary"
                                : isInOther
                                  ? "cursor-not-allowed border-border bg-muted/50 text-muted-foreground opacity-30"
                                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            <span className="font-mono text-[10px]">
                              {coach.id}
                            </span>{" "}
                            {coach.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select leader */}
                  {groupCoaches.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Coach Group Leader
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {groupCoaches.map((coach) => (
                          <button
                            key={coach.id}
                            onClick={() =>
                              setLeader(group.id, coach.id)
                            }
                            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                              group.leaderId === coach.id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            {coach.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coach -> PPs table */}
                  {groupCoaches.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest">
                              Coach
                            </TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                              Participants (Coachees)
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupCoaches.map((coach) => {
                            const pps = getCoachPPs(coach.id);
                            return (
                              <TableRow key={coach.id}>
                                <TableCell className="align-top">
                                  <div className="flex items-center gap-2">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                                      {coach.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        {coach.name}
                                        {group.leaderId === coach.id && (
                                          <Badge
                                            variant="secondary"
                                            className="ml-2 bg-primary/10 text-primary text-[10px]"
                                          >
                                            Leader
                                          </Badge>
                                        )}
                                      </p>
                                      <p className="font-mono text-[10px] text-muted-foreground">
                                        {coach.id}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {pps.length === 0 ? (
                                    <span className="text-xs italic text-muted-foreground">
                                      No participants assigned
                                    </span>
                                  ) : (
                                    <div className="flex flex-wrap gap-1">
                                      {pps.map((pp) => (
                                        <span
                                          key={pp.id}
                                          className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground"
                                        >
                                          {pp.name}
                                          <span className="ml-0.5 font-mono text-[10px] text-muted-foreground">
                                            ({pp.id})
                                          </span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {groups.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <UsersRound className="mb-4 size-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              No groups yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a group above to start organizing coaches and
              participants.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
