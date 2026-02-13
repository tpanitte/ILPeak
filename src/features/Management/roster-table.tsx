"use client";

import { useState } from "react";
import type { CoachListItem } from "@/domain/Performance/Queries/getCoachesList";
import type { ParticipantListItem } from "@/domain/Performance/Queries/getParticipantsList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Users, UserCheck, Search, ArrowRightLeft, Pencil } from "lucide-react";

type Tab = "coaches" | "participants";

interface RosterTableProps {
  coaches: CoachListItem[];
  participants: ParticipantListItem[];
}

function cell(value: string | undefined | null) {
  return value && value.trim() !== "" ? value : "-";
}

export function RosterTable({
  coaches,
  participants: initialParticipants,
}: RosterTableProps) {
  const [tab, setTab] = useState<Tab>("coaches");
  const [participants, setParticipants] = useState(initialParticipants);

  // Edit participant dialog
  const [editPP, setEditPP] = useState<ParticipantListItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editCoachID, setEditCoachID] = useState("");
  const [showCoachPicker, setShowCoachPicker] = useState(false);
  const [searchCoach, setSearchCoach] = useState("");

  function ppCountForCoach(coachID: string) {
    return participants.filter((p) => p.coachID === coachID).length;
  }

  function getCoachName(coachID: string) {
    return coaches.find((c) => c.coachID === coachID)?.name ?? coachID;
  }

  function openEditDialog(pp: ParticipantListItem) {
    setEditPP(pp);
    setEditName(pp.name);
    setEditMobile(pp.mobile ?? "");
    setEditCoachID(pp.coachID);
    setShowCoachPicker(false);
    setSearchCoach("");
  }

  function handleSaveEdit() {
    if (!editPP) return;
    setParticipants((prev) =>
      prev.map((p) =>
        p._id === editPP._id
          ? { ...p, name: editName, mobile: editMobile, coachID: editCoachID }
          : p
      )
    );
    setEditPP(null);
  }

  const filteredCoachesForPicker = coaches.filter((c) =>
    searchCoach === ""
      ? true
      : c.name.toLowerCase().includes(searchCoach.toLowerCase()) ||
        c.coachID.toLowerCase().includes(searchCoach.toLowerCase())
  );

  return (
    <>
      {/* Summary badges */}
      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className="gap-1.5 px-3 py-1.5 text-xs font-medium"
        >
          <Users className="size-3.5" aria-hidden="true" />
          {coaches.length} Coaches
        </Badge>
        <Badge
          variant="secondary"
          className="gap-1.5 px-3 py-1.5 text-xs font-medium"
        >
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
              {coaches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No coaches imported yet. Go to Admin &gt; Import Data to
                    upload coaches.
                  </TableCell>
                </TableRow>
              ) : (
                coaches.map((coach, i) => {
                  const count = ppCountForCoach(coach.coachID);
                  const pps = participants.filter(
                    (p) => p.coachID === coach.coachID
                  );
                  return (
                    <TableRow key={coach._id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {cell(coach.coachID)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {cell(coach.name)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cell(coach.email)}
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
                            {pps.map((p) => p.name || p.ppID).join(", ")}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
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
              {participants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No participants imported yet. Go to Admin &gt; Import Data
                    to upload participants.
                  </TableCell>
                </TableRow>
              ) : (
                participants.map((pp, i) => (
                  <TableRow
                    key={pp._id}
                    className="cursor-pointer transition-colors hover:bg-accent/50"
                    onClick={() => openEditDialog(pp)}
                    title={`Click to edit ${pp.name || pp.ppID}`}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {cell(pp.ppID)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {cell(pp.name)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {cell(pp.mobile)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        {cell(getCoachName(pp.coachID))}
                        <Pencil className="size-3 text-muted-foreground" aria-hidden="true" />
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Participant Dialog */}
      <Dialog
        open={!!editPP}
        onOpenChange={(open) => {
          if (!open) {
            setEditPP(null);
            setShowCoachPicker(false);
            setSearchCoach("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Participant</DialogTitle>
            <DialogDescription>
              Update details for participant{" "}
              <span className="font-semibold text-foreground">
                {editPP?.ppID}
              </span>
              . ID cannot be changed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* ID -- read only */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                ID
              </Label>
              <Input
                value={editPP?.ppID ?? ""}
                disabled
                className="bg-muted font-mono text-sm"
              />
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-medium">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Participant name"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-mobile" className="text-xs font-medium">
                Mobile
              </Label>
              <Input
                id="edit-mobile"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
                placeholder="Mobile number"
              />
            </div>

            {/* Coach */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Coach</Label>
              {!showCoachPicker ? (
                <button
                  type="button"
                  onClick={() => setShowCoachPicker(true)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm transition-colors hover:bg-accent/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium">
                      {getCoachName(editCoachID)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({editCoachID})
                    </span>
                  </span>
                  <ArrowRightLeft
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <div className="space-y-2">
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
                  <div className="max-h-48 overflow-y-auto rounded-md border border-border">
                    {filteredCoachesForPicker.map((coach, idx) => {
                      const isCurrent = editCoachID === coach.coachID;
                      const assignedCount = ppCountForCoach(coach.coachID);
                      return (
                        <button
                          key={coach._id}
                          type="button"
                          onClick={() => {
                            setEditCoachID(coach.coachID);
                            setShowCoachPicker(false);
                            setSearchCoach("");
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                            isCurrent
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-accent"
                          } ${idx !== filteredCoachesForPicker.length - 1 ? "border-b border-border" : ""}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {coach.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {coach.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {coach.coachID}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {assignedCount} PP
                              {assignedCount !== 1 ? "s" : ""}
                            </Badge>
                            {isCurrent && (
                              <Badge className="bg-primary text-xs text-primary-foreground">
                                Current
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                    {filteredCoachesForPicker.length === 0 && (
                      <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                        No coaches match your search.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditPP(null);
                setShowCoachPicker(false);
                setSearchCoach("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
