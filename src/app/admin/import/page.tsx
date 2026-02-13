"use client";

import { useState, useEffect, useCallback } from "react";
import { CSVUploader } from "@/features/Performance/import/csv-uploader";
import {
  importCoachAction,
  importParticipantAction,
} from "@/features/Performance/import/actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Upload,
  Loader2,
  AlertCircle,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

// ---------- Types ----------
interface Coach {
  ID: string;
  Name: string;
  Email: string;
}

interface Participant {
  ID: string;
  Name: string;
  Mobile: string;
  "Coach ID": string;
}

interface ProgramOption {
  _id: string;
  name: string;
  serie: number;
}

type RowStatus = "pending" | "importing" | "done" | "error";

// ---------- Program Selector ----------
function ProgramSelector({
  selected,
  onSelect,
}: {
  selected: ProgramOption | null;
  onSelect: (p: ProgramOption) => void;
}) {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/programs");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setPrograms(data);
      } catch {
        setError("Could not load programs. Make sure programs exist in the database.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading programs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <AlertCircle className="size-4 text-destructive" />
        <span className="text-sm text-destructive">{error}</span>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
        <FolderOpen className="size-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No programs found</p>
          <p className="text-xs text-muted-foreground">
            Create a program first at /admin/programs/new before importing data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/40"
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xs font-bold text-primary">{selected.serie}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{selected.name}</p>
              <p className="text-[10px] text-muted-foreground">Program selected</p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Select a program...</span>
        )}
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
          {programs.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => {
                onSelect(p);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-xs font-bold text-primary">{p.serie}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
              </div>
              {selected?._id === p._id && (
                <CheckCircle className="ml-auto size-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Import Page ----------
export default function ImportPage() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [coachStatuses, setCoachStatuses] = useState<RowStatus[]>([]);
  const [ppStatuses, setPpStatuses] = useState<RowStatus[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  function handleCoachUpload(rows: Record<string, string>[]) {
    const parsed = rows as unknown as Coach[];
    setCoaches(parsed);
    setCoachStatuses(parsed.map(() => "pending"));
  }

  function handleParticipantUpload(rows: Record<string, string>[]) {
    const parsed = rows as unknown as Participant[];
    setParticipants(parsed);
    setPpStatuses(parsed.map(() => "pending"));
  }

  const handleImport = useCallback(async () => {
    if (!selectedProgram) return;
    setIsImporting(true);

    // Import coaches one by one
    for (let i = 0; i < coaches.length; i++) {
      setCoachStatuses((prev) => {
        const next = [...prev];
        next[i] = "importing";
        return next;
      });

      try {
        await importCoachAction(selectedProgram._id, {
          coachID: coaches[i].ID,
          name: coaches[i].Name,
          email: coaches[i].Email,
        });
        setCoachStatuses((prev) => {
          const next = [...prev];
          next[i] = "done";
          return next;
        });
      } catch {
        setCoachStatuses((prev) => {
          const next = [...prev];
          next[i] = "error";
          return next;
        });
      }
    }

    // Import participants one by one
    for (let i = 0; i < participants.length; i++) {
      setPpStatuses((prev) => {
        const next = [...prev];
        next[i] = "importing";
        return next;
      });

      try {
        await importParticipantAction(selectedProgram._id, {
          ppID: participants[i].ID,
          name: participants[i].Name,
          mobile: participants[i].Mobile ?? "",
          coachID: participants[i]["Coach ID"],
        });
        setPpStatuses((prev) => {
          const next = [...prev];
          next[i] = "done";
          return next;
        });
      } catch {
        setPpStatuses((prev) => {
          const next = [...prev];
          next[i] = "error";
          return next;
        });
      }
    }

    setIsImporting(false);
  }, [selectedProgram, coaches, participants]);

  const totalRows = coaches.length + participants.length;
  const doneCount =
    coachStatuses.filter((s) => s === "done").length +
    ppStatuses.filter((s) => s === "done").length;
  const errorCount =
    coachStatuses.filter((s) => s === "error").length +
    ppStatuses.filter((s) => s === "error").length;
  const allDone = totalRows > 0 && doneCount + errorCount === totalRows;

  function statusBadge(status: RowStatus) {
    switch (status) {
      case "pending":
        return null;
      case "importing":
        return (
          <Loader2 className="size-3.5 animate-spin text-primary" />
        );
      case "done":
        return <CheckCircle className="size-3.5 text-green-600" />;
      case "error":
        return <AlertCircle className="size-3.5 text-destructive" />;
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Import Data
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a program, then upload CSV files for Coaches and Participants.
          Each row dispatches a separate import event.
        </p>
      </div>

      {/* Step 1: Program Selection */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </div>
            <div>
              <CardTitle className="text-base">Select Program</CardTitle>
              <CardDescription>
                Choose the program to import coaches and participants into.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProgramSelector
            selected={selectedProgram}
            onSelect={setSelectedProgram}
          />
        </CardContent>
      </Card>

      {/* Step 2: Upload CSVs (only visible after program selected) */}
      {selectedProgram && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
              <div>
                <CardTitle className="text-base">Upload CSV Files</CardTitle>
                <CardDescription>
                  Importing into{" "}
                  <span className="font-semibold text-foreground">
                    {selectedProgram.name}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CSVUploader type="COACH" onUpload={handleCoachUpload} />
              <CSVUploader type="PP" onUpload={handleParticipantUpload} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coaches Preview Table */}
      {coaches.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Coaches</CardTitle>
                <CardDescription>
                  {coaches.length} row{coaches.length !== 1 ? "s" : ""} &mdash;
                  each row = 1 CoachImported event
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className={
                  allDone && coachStatuses.every((s) => s === "done")
                    ? "bg-green-600/10 text-green-600"
                    : "bg-primary/10 text-primary"
                }
              >
                {coachStatuses.filter((s) => s === "done").length}/{coaches.length} imported
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-[10px] font-bold uppercase tracking-widest">
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
                    <TableHead className="w-10 text-[10px] font-bold uppercase tracking-widest">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.map((c, i) => (
                    <TableRow
                      key={i}
                      className={
                        coachStatuses[i] === "done"
                          ? "bg-green-50/50"
                          : coachStatuses[i] === "error"
                            ? "bg-destructive/5"
                            : ""
                      }
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.ID}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {c.Name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.Email}
                      </TableCell>
                      <TableCell>{statusBadge(coachStatuses[i])}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants Preview Table */}
      {participants.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Participants</CardTitle>
                <CardDescription>
                  {participants.length} row{participants.length !== 1 ? "s" : ""}{" "}
                  &mdash; each row = 1 ParticipantImported event
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className={
                  allDone && ppStatuses.every((s) => s === "done")
                    ? "bg-green-600/10 text-green-600"
                    : "bg-primary/10 text-primary"
                }
              >
                {ppStatuses.filter((s) => s === "done").length}/{participants.length} imported
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-[10px] font-bold uppercase tracking-widest">
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
                      Coach ID
                    </TableHead>
                    <TableHead className="w-10 text-[10px] font-bold uppercase tracking-widest">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((p, i) => (
                    <TableRow
                      key={i}
                      className={
                        ppStatuses[i] === "done"
                          ? "bg-green-50/50"
                          : ppStatuses[i] === "error"
                            ? "bg-destructive/5"
                            : ""
                      }
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {p.ID}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {p.Name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p.Mobile}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {p["Coach ID"]}
                      </TableCell>
                      <TableCell>{statusBadge(ppStatuses[i])}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Progress & Action */}
      {totalRows > 0 && selectedProgram && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            {isImporting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Importing... {doneCount}/{totalRows} events dispatched
                {errorCount > 0 && (
                  <span className="text-destructive">({errorCount} errors)</span>
                )}
              </span>
            ) : allDone ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="size-4" />
                Import complete. {doneCount} events dispatched.
                {errorCount > 0 && (
                  <span className="text-destructive"> {errorCount} errors.</span>
                )}
              </span>
            ) : (
              <span>
                {totalRows} rows ready ({coaches.length} coaches + {participants.length} PPs)
              </span>
            )}
          </div>
          <Button
            size="lg"
            onClick={handleImport}
            disabled={isImporting || allDone || totalRows === 0}
          >
            {isImporting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Upload className="mr-2 size-4" />
            )}
            {allDone ? "Imported" : isImporting ? "Importing..." : "Import All"}
          </Button>
        </div>
      )}
    </div>
  );
}
