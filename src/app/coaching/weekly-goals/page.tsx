"use client";

import { useState, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Save,
  Filter,
} from "lucide-react";
import { COACHES, PARTICIPANTS, getCoachPPs } from "@/lib/mock-data";

// ── Date utilities (week starts Saturday) ──────────────────────────────

function getSaturday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 6 ? 0 : -(day + 1);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

const WEEK_DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

interface WeeklyGoal {
  ppId: string;
  coachId: string;
  gcfTarget: number;
  coTarget: number;
  dailyGCF: (number | null)[];
  dailyCO: (number | null)[];
}

export default function WeeklyGoalsPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("ALL");

  const saturdayAnchor = useMemo(() => {
    const sat = getSaturday(new Date());
    return addDays(sat, weekOffset * 7);
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(saturdayAnchor, i));
  }, [saturdayAnchor]);

  const friday = weekDates[6];
  const isCurrentWeek = weekOffset === 0;

  const now = new Date();
  const mondayDeadline = addDays(saturdayAnchor, 2);
  mondayDeadline.setHours(23, 59, 59, 999);
  const goalsLocked = now > mondayDeadline && isCurrentWeek;

  // Initialize goals for ALL 40 PPs
  const [goals, setGoals] = useState<WeeklyGoal[]>(() =>
    PARTICIPANTS.map((pp) => ({
      ppId: pp.id,
      coachId: pp.coachId,
      gcfTarget: 5,
      coTarget: 20,
      dailyGCF: [
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3),
        null,
        null,
        null,
        null,
        null,
      ],
      dailyCO: [
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 8) + 2,
        null,
        null,
        null,
        null,
        null,
      ],
    }))
  );

  // Filter by coach
  const filteredGoals = useMemo(() => {
    if (selectedCoachId === "ALL") return goals;
    return goals.filter((g) => g.coachId === selectedCoachId);
  }, [goals, selectedCoachId]);

  // Group by coach for the display
  const goalsByCoach = useMemo(() => {
    const map = new Map<string, WeeklyGoal[]>();
    filteredGoals.forEach((g) => {
      const arr = map.get(g.coachId) || [];
      arr.push(g);
      map.set(g.coachId, arr);
    });
    return map;
  }, [filteredGoals]);

  function updateGoal(
    ppId: string,
    field: "gcfTarget" | "coTarget",
    value: number
  ) {
    setGoals(
      goals.map((g) => (g.ppId === ppId ? { ...g, [field]: value } : g))
    );
  }

  function updateDaily(
    ppId: string,
    dayIndex: number,
    metric: "gcf" | "co",
    value: number | null
  ) {
    setGoals(
      goals.map((g) => {
        if (g.ppId !== ppId) return g;
        if (metric === "gcf") {
          const arr = [...g.dailyGCF];
          arr[dayIndex] = value;
          return { ...g, dailyGCF: arr };
        } else {
          const arr = [...g.dailyCO];
          arr[dayIndex] = value;
          return { ...g, dailyCO: arr };
        }
      })
    );
  }

  function getTotal(arr: (number | null)[]): number {
    return arr.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Weekly Goals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set weekly targets and track daily results. Week runs Saturday to
          Friday. Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredGoals.length}
          </span>{" "}
          participants across{" "}
          <span className="font-semibold text-foreground">
            {goalsByCoach.size}
          </span>{" "}
          coach{goalsByCoach.size !== 1 ? "es" : ""}.
        </p>
      </div>

      {/* Controls bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(weekOffset - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="min-w-[180px] text-center">
            <span className="text-sm font-semibold text-foreground">
              {formatShort(saturdayAnchor)} &ndash; {formatShort(friday)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(weekOffset + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {isCurrentWeek && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Current Week
          </Badge>
        )}
        {goalsLocked && (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            <AlertCircle className="mr-1 size-3" />
            Goals locked (past Monday)
          </Badge>
        )}

        {/* Coach filter */}
        <div className="ml-auto flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={selectedCoachId}
            onChange={(e) => setSelectedCoachId(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="ALL">All Coaches ({COACHES.length})</option>
            {COACHES.map((c) => {
              const ppCount = getCoachPPs(c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({ppCount} PPs)
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Grouped by coach */}
      {Array.from(goalsByCoach.entries()).map(([coachId, coachGoals]) => {
        const coach = COACHES.find((c) => c.id === coachId);
        return (
          <Card key={coachId} className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {coach?.name.charAt(0) ?? "?"}
                </div>
                <div>
                  <CardTitle className="text-base">
                    {coach?.name ?? coachId}
                  </CardTitle>
                  <CardDescription>
                    {coachGoals.length} participant
                    {coachGoals.length !== 1 ? "s" : ""} &middot; {coachId}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* GCF sub-table */}
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Guest Confirmed (GCF)
              </p>
              <div className="mb-4 overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px] text-[10px] font-bold uppercase tracking-widest">
                        PP
                      </TableHead>
                      <TableHead className="w-[72px] bg-primary/5 text-center text-[10px] font-bold uppercase tracking-widest text-primary">
                        Target
                      </TableHead>
                      {weekDates.map((date, i) => (
                        <TableHead
                          key={i}
                          className={`w-[60px] text-center text-[10px] font-bold uppercase tracking-widest ${isToday(date) ? "bg-primary/10 text-primary" : ""}`}
                        >
                          <div>{WEEK_DAYS[i]}</div>
                          <div className="font-mono font-normal text-muted-foreground">
                            {date.getDate()}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-[60px] text-center text-[10px] font-bold uppercase tracking-widest">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coachGoals.map((goal) => {
                      const pp = PARTICIPANTS.find(
                        (p) => p.id === goal.ppId
                      )!;
                      const total = getTotal(goal.dailyGCF);
                      const onTrack = total >= goal.gcfTarget;
                      return (
                        <TableRow key={goal.ppId}>
                          <TableCell>
                            <div className="text-sm font-medium text-foreground">
                              {pp.name}
                            </div>
                            <div className="font-mono text-[10px] text-muted-foreground">
                              {pp.id}
                            </div>
                          </TableCell>
                          <TableCell className="bg-primary/5 p-1">
                            <Input
                              type="number"
                              min={0}
                              value={goal.gcfTarget}
                              onChange={(e) =>
                                updateGoal(
                                  goal.ppId,
                                  "gcfTarget",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              disabled={goalsLocked}
                              className="h-7 text-center text-xs font-bold"
                            />
                          </TableCell>
                          {weekDates.map((date, i) => (
                            <TableCell
                              key={i}
                              className={`p-1 ${isToday(date) ? "bg-primary/5" : ""}`}
                            >
                              <Input
                                type="number"
                                min={0}
                                value={goal.dailyGCF[i] ?? ""}
                                onChange={(e) =>
                                  updateDaily(
                                    goal.ppId,
                                    i,
                                    "gcf",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="-"
                                className="h-7 w-12 p-0 text-center text-xs"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center">
                            <span
                              className={`font-mono text-xs font-bold ${onTrack ? "text-[var(--success)]" : "text-[var(--warning)]"}`}
                            >
                              {total}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* C/O sub-table */}
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Call Out (C/O)
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px] text-[10px] font-bold uppercase tracking-widest">
                        PP
                      </TableHead>
                      <TableHead className="w-[72px] bg-primary/5 text-center text-[10px] font-bold uppercase tracking-widest text-primary">
                        Target
                      </TableHead>
                      {weekDates.map((date, i) => (
                        <TableHead
                          key={i}
                          className={`w-[60px] text-center text-[10px] font-bold uppercase tracking-widest ${isToday(date) ? "bg-primary/10 text-primary" : ""}`}
                        >
                          <div>{WEEK_DAYS[i]}</div>
                          <div className="font-mono font-normal text-muted-foreground">
                            {date.getDate()}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-[60px] text-center text-[10px] font-bold uppercase tracking-widest">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coachGoals.map((goal) => {
                      const pp = PARTICIPANTS.find(
                        (p) => p.id === goal.ppId
                      )!;
                      const total = getTotal(goal.dailyCO);
                      const onTrack = total >= goal.coTarget;
                      return (
                        <TableRow key={goal.ppId}>
                          <TableCell>
                            <div className="text-sm font-medium text-foreground">
                              {pp.name}
                            </div>
                            <div className="font-mono text-[10px] text-muted-foreground">
                              {pp.id}
                            </div>
                          </TableCell>
                          <TableCell className="bg-primary/5 p-1">
                            <Input
                              type="number"
                              min={0}
                              value={goal.coTarget}
                              onChange={(e) =>
                                updateGoal(
                                  goal.ppId,
                                  "coTarget",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              disabled={goalsLocked}
                              className="h-7 text-center text-xs font-bold"
                            />
                          </TableCell>
                          {weekDates.map((date, i) => (
                            <TableCell
                              key={i}
                              className={`p-1 ${isToday(date) ? "bg-primary/5" : ""}`}
                            >
                              <Input
                                type="number"
                                min={0}
                                value={goal.dailyCO[i] ?? ""}
                                onChange={(e) =>
                                  updateDaily(
                                    goal.ppId,
                                    i,
                                    "co",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="-"
                                className="h-7 w-12 p-0 text-center text-xs"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center">
                            <span
                              className={`font-mono text-xs font-bold ${onTrack ? "text-[var(--success)]" : "text-[var(--warning)]"}`}
                            >
                              {total}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Save */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="mr-2 size-4" />
          Save Goals &amp; Results
        </Button>
      </div>
    </div>
  );
}
