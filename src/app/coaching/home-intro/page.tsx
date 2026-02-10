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
  Home,
  Plus,
  Trash2,
  Clock,
  CalendarDays,
  User,
} from "lucide-react";

// ── Mock participants ──────────────────────────────────────────────────

const MOCK_PPS = [
  { id: "PP001", name: "Areeya K." },
  { id: "PP002", name: "Boonsri R." },
  { id: "PP003", name: "Chalerm N." },
  { id: "PP004", name: "Duangjai F." },
  { id: "PP005", name: "Ekachai V." },
  { id: "PP006", name: "Fongchan B." },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

interface HomeIntroSession {
  id: string;
  ppId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // auto-calculated +3h
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const newH = h + hours;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomeIntroPage() {
  const [sessions, setSessions] = useState<HomeIntroSession[]>([
    {
      id: "HI1",
      ppId: "PP001",
      date: "2026-02-14",
      startTime: "10:00",
      endTime: "13:00",
      status: "SCHEDULED",
    },
    {
      id: "HI2",
      ppId: "PP003",
      date: "2026-02-15",
      startTime: "14:00",
      endTime: "17:00",
      status: "COMPLETED",
    },
  ]);

  // New session form
  const [newPpId, setNewPpId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");

  function addSession() {
    if (!newPpId || !newDate || !newTime) return;
    const id = `HI${Date.now()}`;
    const endTime = addHours(newTime, 3);
    setSessions([
      ...sessions,
      {
        id,
        ppId: newPpId,
        date: newDate,
        startTime: newTime,
        endTime,
        status: "SCHEDULED",
      },
    ]);
    setNewPpId("");
    setNewDate("");
    setNewTime("10:00");
  }

  function removeSession(id: string) {
    setSessions(sessions.filter((s) => s.id !== id));
  }

  function toggleStatus(id: string) {
    setSessions(
      sessions.map((s) => {
        if (s.id !== id) return s;
        if (s.status === "SCHEDULED") return { ...s, status: "COMPLETED" };
        if (s.status === "COMPLETED") return { ...s, status: "CANCELLED" };
        return { ...s, status: "SCHEDULED" };
      })
    );
  }

  const statusColor: Record<string, string> = {
    SCHEDULED: "bg-primary/10 text-primary",
    COMPLETED: "bg-success/10 text-success",
    CANCELLED: "bg-destructive/10 text-destructive",
  };

  // Sort sessions by date, then time
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // Group by date for visual separation
  const groupedByDate = sortedSessions.reduce<
    Record<string, HomeIntroSession[]>
  >((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Home Introduction
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Schedule Home Intro sessions for participants. Each session is 3 hours
          long.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Badge variant="secondary">
          <CalendarDays className="mr-1 size-3" />
          {sessions.length} Session{sessions.length !== 1 ? "s" : ""}
        </Badge>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {sessions.filter((s) => s.status === "SCHEDULED").length} Upcoming
        </Badge>
        <Badge variant="secondary" className="bg-success/10 text-success">
          {sessions.filter((s) => s.status === "COMPLETED").length} Completed
        </Badge>
      </div>

      {/* Schedule new session */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Schedule New Session</CardTitle>
          <CardDescription>
            Select a participant, date, and start time. End time is
            automatically set to +3 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            {/* Participant select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Participant
              </label>
              <select
                value={newPpId}
                onChange={(e) => setNewPpId(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">Select PP...</option>
                {MOCK_PPS.map((pp) => (
                  <option key={pp.id} value={pp.id}>
                    {pp.name} ({pp.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Date
              </label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="h-9 w-[160px]"
              />
            </div>

            {/* Start time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Start Time
              </label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t} &ndash; {addHours(t, 3)}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={addSession}
              disabled={!newPpId || !newDate || !newTime}
            >
              <Plus className="mr-2 size-4" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions list grouped by date */}
      {Object.keys(groupedByDate).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Home className="mb-4 size-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              No sessions scheduled
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the form above to schedule a Home Intro session.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(groupedByDate).map(([date, dateSessions]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="size-4 text-primary" />
                  {formatDate(date)}
                </CardTitle>
                <CardDescription>
                  {dateSessions.length} session
                  {dateSessions.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                          Participant
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                          Time
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                          Duration
                        </TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                          Status
                        </TableHead>
                        <TableHead className="w-[80px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateSessions.map((session) => {
                        const pp = MOCK_PPS.find(
                          (p) => p.id === session.ppId
                        );
                        return (
                          <TableRow key={session.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                  <User className="size-3.5" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {pp?.name ?? session.ppId}
                                  </p>
                                  <p className="font-mono text-[10px] text-muted-foreground">
                                    {session.ppId}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Clock className="size-3.5 text-muted-foreground" />
                                {session.startTime} &ndash;{" "}
                                {session.endTime}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                3 hours
                              </span>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => toggleStatus(session.id)}
                                className="cursor-pointer"
                              >
                                <Badge
                                  variant="secondary"
                                  className={
                                    statusColor[session.status]
                                  }
                                >
                                  {session.status}
                                </Badge>
                              </button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeSession(session.id)
                                }
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                                <span className="sr-only">
                                  Remove session
                                </span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
