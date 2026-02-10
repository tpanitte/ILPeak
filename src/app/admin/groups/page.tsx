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

// ── Mock data for preview ──────────────────────────────────────────────

const MOCK_COACHES = [
  { id: "C001", name: "Somchai T.", email: "somchai@example.com" },
  { id: "C002", name: "Anurak P.", email: "anurak@example.com" },
  { id: "C003", name: "Kanya S.", email: "kanya@example.com" },
  { id: "C004", name: "Preecha L.", email: "preecha@example.com" },
  { id: "C005", name: "Narong W.", email: "narong@example.com" },
  { id: "C006", name: "Suda M.", email: "suda@example.com" },
];

const MOCK_PARTICIPANTS = [
  { id: "PP001", name: "Areeya K.", mobile: "081-111-1111", coachId: "C001" },
  { id: "PP002", name: "Boonsri R.", mobile: "081-222-2222", coachId: "C001" },
  { id: "PP003", name: "Chalerm N.", mobile: "081-333-3333", coachId: "C002" },
  { id: "PP004", name: "Duangjai F.", mobile: "081-444-4444", coachId: "C002" },
  { id: "PP005", name: "Ekachai V.", mobile: "081-555-5555", coachId: "C003" },
  { id: "PP006", name: "Fongchan B.", mobile: "081-666-6666", coachId: "C003" },
  { id: "PP007", name: "Gamon S.", mobile: "081-777-7777", coachId: "C004" },
  { id: "PP008", name: "Hansa D.", mobile: "081-888-8888", coachId: "C005" },
  { id: "PP009", name: "Issara J.", mobile: "081-999-9999", coachId: "C005" },
  { id: "PP010", name: "Jutarat P.", mobile: "082-000-0000", coachId: "C006" },
];

interface Group {
  id: string;
  name: string;
  leaderId: string; // Coach Group Leader
  coachIds: string[];
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "G1",
      name: "Alpha Team",
      leaderId: "C001",
      coachIds: ["C001", "C002"],
    },
    {
      id: "G2",
      name: "Beta Team",
      leaderId: "C003",
      coachIds: ["C003", "C004"],
    },
  ]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("G1");
  const [newGroupName, setNewGroupName] = useState("");

  const coaches = MOCK_COACHES;
  const participants = MOCK_PARTICIPANTS;

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
      groups.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, leaderId: coachId };
      })
    );
  }

  function getCoachPPs(coachId: string) {
    return participants.filter((p) => p.coachId === coachId);
  }

  // Coaches already assigned to any group
  const assignedCoachIds = new Set(groups.flatMap((g) => g.coachIds));
  const unassignedCoaches = coaches.filter(
    (c) => !assignedCoachIds.has(c.id)
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Group Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organize Coaches and Participants into groups. Each group has a Coach
          Group Leader.
        </p>
      </div>

      {/* Summary badges */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Badge variant="secondary">
          <UsersRound className="mr-1 size-3" />
          {coaches.length} Coaches
        </Badge>
        <Badge variant="secondary">
          <UserCheck className="mr-1 size-3" />
          {participants.length} Participants
        </Badge>
        <Badge variant="secondary">
          {groups.length} Group{groups.length !== 1 ? "s" : ""}
        </Badge>
        {unassignedCoaches.length > 0 && (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
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
          const groupCoaches = coaches.filter((c) =>
            group.coachIds.includes(c.id)
          );
          const leader = coaches.find((c) => c.id === group.leaderId);
          const groupPPs = participants.filter((p) =>
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
                      <CardTitle className="text-base">{group.name}</CardTitle>
                      <CardDescription>
                        {groupCoaches.length} coach
                        {groupCoaches.length !== 1 ? "es" : ""},{" "}
                        {groupPPs.length} participant
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
                  {/* Assign coaches */}
                  <div className="mb-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Assign Coaches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {coaches.map((coach) => {
                        const isInGroup = group.coachIds.includes(coach.id);
                        const isInOther =
                          !isInGroup && assignedCoachIds.has(coach.id);
                        return (
                          <button
                            key={coach.id}
                            onClick={() =>
                              !isInOther && toggleCoach(group.id, coach.id)
                            }
                            disabled={isInOther}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                              isInGroup
                                ? "border-primary bg-primary/10 text-primary"
                                : isInOther
                                  ? "cursor-not-allowed border-border bg-muted/50 text-muted-foreground opacity-40"
                                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            <span className="font-mono text-[10px]">
                              {coach.id}
                            </span>
                            <span>{coach.name}</span>
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
                      <div className="flex flex-wrap gap-2">
                        {groupCoaches.map((coach) => (
                          <button
                            key={coach.id}
                            onClick={() => setLeader(group.id, coach.id)}
                            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
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

                  {/* Coaches + their PPs table */}
                  {groupCoaches.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">
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
                                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                      {coach.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        {coach.name}
                                        {group.leaderId === coach.id && (
                                          <Badge
                                            variant="secondary"
                                            className="ml-2 bg-primary/10 text-primary"
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
                                    <span className="text-xs text-muted-foreground italic">
                                      No participants assigned
                                    </span>
                                  ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                      {pps.map((pp) => (
                                        <span
                                          key={pp.id}
                                          className="rounded-md bg-muted px-2 py-1 text-xs text-foreground"
                                        >
                                          {pp.name}
                                          <span className="ml-1 font-mono text-[10px] text-muted-foreground">
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
              Create a group above to start organizing coaches and participants.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
