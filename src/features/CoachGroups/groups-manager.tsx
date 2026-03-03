"use client";

import { useState, useTransition } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, UsersRound, Search, UserCheck, Crown } from "lucide-react";
import type { CoachListItem } from "@/domain/Performance/Queries/getCoachesList";
import type { CoachGroupListItem } from "@/domain/Performance/Queries/getCoachGroupsList";
import { createCoachGroupAction } from "./actions";

interface Props {
  programId: string;
  initialCoaches: CoachListItem[];
  initialGroups: CoachGroupListItem[];
}

export function GroupsManager({ programId, initialCoaches, initialGroups }: Props) {
  const [groups, setGroups] = useState<CoachGroupListItem[]>(initialGroups);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedLeader, setSelectedLeader] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const coaches = initialCoaches;

  function getCoachName(coachID: string) {
    return coaches.find((c) => c.coachID === coachID)?.name ?? coachID;
  }

  const filteredCoaches = coaches.filter(
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
          setDialogOpen(false);
          setNewGroupName("");
          setSelectedLeader("");
          setSearchQuery("");
        }
      } catch (err) {
        console.error("Failed to create group:", err);
      }
    });
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Coach Groups
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create groups and assign a Coach Leader for each.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
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
        <Badge variant="secondary">
          {groups.length} Group{groups.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Groups list */}
      {groups.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-[10px] font-bold uppercase tracking-widest">
                  #
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Group Name
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Coach Leader
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Leader ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((g, i) => (
                <TableRow key={g._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <UsersRound className="size-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {g.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Crown className="size-3.5 text-amber-500" />
                      <span className="text-sm font-medium text-foreground">
                        {getCoachName(g.leaderCoachID)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {g.leaderCoachID}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      {/* Create Group Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Coach Group</DialogTitle>
            <DialogDescription>
              Enter a group name and select a coach to be the group leader.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-2">
            {/* Group name */}
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

            {/* Select Coach Leader */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Coach Leader
              </label>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or name..."
                  className="pl-9"
                />
              </div>

              {/* Coach list */}
              <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                {filteredCoaches.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    {coaches.length === 0
                      ? "No coaches imported yet. Import coaches first."
                      : "No coaches match your search."}
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredCoaches.map((coach) => {
                      const isSelected = selectedLeader === coach.coachID;
                      return (
                        <button
                          key={coach.coachID}
                          type="button"
                          onClick={() => setSelectedLeader(coach.coachID)}
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
                              {coach.email && (
                                <span className="ml-2 font-sans">
                                  {coach.email}
                                </span>
                              )}
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

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setNewGroupName("");
                  setSelectedLeader("");
                  setSearchQuery("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newGroupName.trim() || !selectedLeader || isPending}
              >
                {isPending ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
