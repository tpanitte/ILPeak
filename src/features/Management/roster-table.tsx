"use client";

import { useState } from "react";
import type { CoachListItem } from "@/domain/Performance/Queries/getCoachesList";
import type { ParticipantListItem } from "@/domain/Performance/Queries/getParticipantsList";
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

interface RosterTableProps {
  coaches: CoachListItem[];
  participants: ParticipantListItem[];
}

export function RosterTable({ coaches, participants: initialParticipants }: RosterTableProps) {
  const [tab, setTab] = useState<Tab>("coaches");
  const [participants, setParticipants] = useState(initialParticipants);
  const [reassignPP, setReassignPP] = useState<ParticipantListItem | null>(null);
  const [searchCoach, setSearchCoach] = useState("");

  function ppCountForCoach(coachID: string) {
    return participants.filter((p) => p.coachID === coachID).length;
  }

  function getCoachName(coachID: string) {
    return coaches.find((c) => c.coachID === coachID)?.name ?? coachID;
  }

  function handleReassign(pp: ParticipantListItem, newCoachID: string) {
    setParticipants((prev) =>
      prev.map((p) => (p._id === pp._id ? { ...p, coachID: newCoachID } : p))
    );
    setReassignPP(null);
    setSearchCoach("");
  }

  const filteredCoaches = coaches.filter((c) =>
    searchCoach === ""
      ? true
      : c.name.toLowerCase().includes(searchCoach.toLowerCase()) ||
        c.coachID.toLowerCase().includes(searchCoach.toLowerCase())
  );

  return (
    <>
      {/* Summary badges */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs font-medium">
          <Users className="size-3.5" aria-hidden="true" />
          {coaches.length} Coaches
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
          {coaches.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No coaches imported yet. Go to Admin &gt; Import Data to upload coaches.
            </div>
          ) : (
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
                {coaches.map((coach, i) => {
                  const count = ppCountForCoach(coach.coachID);
                  const pps = participants.filter((p) => p.coachID === coach.coachID);
                  return (
                    <TableRow key={coach._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{coach.coachID}</TableCell>
                      <TableCell className="text-sm font-medium">{coach.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{coach.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={count === 0 ? "outline" : "secondary"} className="text-xs">
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
          )}
        </div>
      )}

      {/* Participants Table */}
      {tab === "participants" && (
        <div className="rounded-lg border border-border bg-card">
          {participants.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No participants imported yet. Go to Admin &gt; Import Data to upload participants.
            </div>
          ) : (
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
                    Coach
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((pp, i) => (
                  <TableRow key={pp._id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{pp.ppID}</TableCell>
                    <TableCell className="text-sm font-medium">{pp.name}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setReassignPP(pp);
                          setSearchCoach("");
                        }}
                        className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                        title={`Reassign ${pp.name} to a different coach`}
                      >
                        {getCoachName(pp.coachID)}
                        <ArrowRightLeft
                          className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
              <span className="font-semibold text-foreground">{reassignPP?.name}</span> (currently:{" "}
              <span className="font-semibold text-foreground">
                {reassignPP ? getCoachName(reassignPP.coachID) : ""}
              </span>
              )
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
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
            {filteredCoaches.map((coach, idx) => {
              const isCurrent = reassignPP?.coachID === coach.coachID;
              const assignedCount = ppCountForCoach(coach.coachID);
              return (
                <button
                  key={coach._id}
                  onClick={() => {
                    if (!isCurrent && reassignPP) {
                      handleReassign(reassignPP, coach.coachID);
                    }
                  }}
                  disabled={isCurrent}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                    isCurrent
                      ? "cursor-default bg-primary/5 text-primary"
                      : "hover:bg-accent"
                  } ${idx !== filteredCoaches.length - 1 ? "border-b border-border" : ""}`}
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
                      <p className="text-xs text-muted-foreground">{coach.coachID}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {assignedCount} PP{assignedCount !== 1 ? "s" : ""}
                    </Badge>
                    {isCurrent && (
                      <Badge className="bg-primary text-primary-foreground text-xs">Current</Badge>
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
    </>
  );
}
