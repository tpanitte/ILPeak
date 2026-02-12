"use client";

import { useState } from "react";
import {
  COACHES,
  PARTICIPANTS,
  getCoachById,
  type MockParticipant,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Users, UserCheck, Search, ArrowRightLeft } from "lucide-react";

type Tab = "coaches" | "participants";

export default function RosterPage() {
  const [tab, setTab] = useState<Tab>("coaches");
  const [participants, setParticipants] = useState<MockParticipant[]>([...PARTICIPANTS]);
  const [reassignPP, setReassignPP] = useState<MockParticipant | null>(null);
  const [searchCoach, setSearchCoach] = useState("");

  // Coach stats: count PPs per coach
  function ppCountForCoach(coachId: string) {
    return participants.filter((p) => p.coachId === coachId).length;
  }

  function handleReassign(pp: MockParticipant, newCoachId: string) {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === pp.id ? { ...p, coachId: newCoachId } : p
      )
    );
    setReassignPP(null);
    setSearchCoach("");
  }

  const filteredCoaches = COACHES.filter((c) =>
    searchCoach === ""
      ? true
      : c.name.toLowerCase().includes(searchCoach.toLowerCase()) ||
        c.id.toLowerCase().includes(searchCoach.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Coaches & Participants
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all coaches and participants. Click a coach name to reassign a participant.
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium">
          <Users className="size-3.5" aria-hidden="true" />
          {COACHES.length} Coaches
        </Badge>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium">
          <UserCheck className="size-3.5" aria-hidden="true" />
          {participants.length} Participants
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        <button
          onClick={() => setTab("coaches")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "coaches"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-4" aria-hidden="true" />
          Coaches
        </button>
        <button
          onClick={() => setTab("participants")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "participants"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="size-4" aria-hidden="true" />
          Participants
        </button>
      </div>

      {/* Coaches Table */}
      {tab === "coaches" && (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-[10px] font-bold uppercase tracking-widest">
                  #
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  ID
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Name
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Email
                </TableHead>
                <TableHead className="w-24 text-center text-[10px] font-bold uppercase tracking-widest">
                  PPs
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COACHES.map((coach, i) => {
                const count = ppCountForCoach(coach.id);
                const pps = participants.filter((p) => p.coachId === coach.id);
                return (
                  <TableRow key={coach.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {coach.id}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {coach.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {coach.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={count === 0 ? "outline" : "secondary"}
                        className="text-xs"
                      >
                        {count}
                      </Badge>
                      {pps.length > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {pps.map((p) => p.name).join(", ")}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Participants Table */}
      {tab === "participants" && (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-[10px] font-bold uppercase tracking-widest">
                  #
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  ID
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Name
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Mobile
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                  Coach
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((pp, i) => {
                const coach = getCoachById(pp.coachId);
                return (
                  <TableRow key={pp.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {pp.id}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {pp.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {pp.mobile || "--"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setReassignPP(pp);
                          setSearchCoach("");
                        }}
                        className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                        title={`Reassign ${pp.name} to a different coach`}
                      >
                        {coach?.name ?? pp.coachId}
                        <ArrowRightLeft className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Reassign Coach Dialog */}
      <Dialog
        open={!!reassignPP}
        onOpenChange={(open) => {
          if (!open) {
            setReassignPP(null);
            setSearchCoach("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reassign Coach</DialogTitle>
            <DialogDescription>
              Select a new coach for{" "}
              <span className="font-semibold text-foreground">
                {reassignPP?.name}
              </span>{" "}
              (currently:{" "}
              <span className="font-semibold text-foreground">
                {reassignPP ? (getCoachById(reassignPP.coachId)?.name ?? reassignPP.coachId) : ""}
              </span>
              )
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={searchCoach}
              onChange={(e) => setSearchCoach(e.target.value)}
              placeholder="Search coaches..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Coach list */}
          <div className="max-h-72 overflow-y-auto rounded-md border border-border">
            {filteredCoaches.map((coach) => {
              const isCurrent = reassignPP?.coachId === coach.id;
              const assignedCount = ppCountForCoach(coach.id);
              return (
                <button
                  key={coach.id}
                  onClick={() => {
                    if (!isCurrent && reassignPP) {
                      handleReassign(reassignPP, coach.id);
                    }
                  }}
                  disabled={isCurrent}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                    isCurrent
                      ? "cursor-default bg-primary/5 text-primary"
                      : "hover:bg-accent"
                  } ${filteredCoaches.indexOf(coach) !== filteredCoaches.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {coach.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{coach.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {coach.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {assignedCount} PP{assignedCount !== 1 ? "s" : ""}
                    </Badge>
                    {isCurrent && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
            {filteredCoaches.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No coaches match your search.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
