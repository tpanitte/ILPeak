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
  Target,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Save,
} from "lucide-react";

// ── Date utilities (week starts Saturday) ──────────────────────────────

function getSaturday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun ... 6=Sat
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

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isBeforeToday(date: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
}

// ── Mock data ──────────────────────────────────────────────────────────

const MOCK_PPS = [
  { id: "PP001", name: "Areeya K.", coachId: "C001" },
  { id: "PP002", name: "Boonsri R.", coachId: "C001" },
  { id: "PP003", name: "Chalerm N.", coachId: "C001" },
  { id: "PP004", name: "Duangjai F.", coachId: "C001" },
];

const WEEK_DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

interface WeeklyGoal {
  ppId: string;
  gcfTarget: number;
  coTarget: number;
  dailyGCF: (number | null)[];
  dailyCO: (number | null)[];
}

export default function WeeklyGoalsPage() {
  const [weekOffset, setWeekOffset] = useState(0);

  const saturdayAnchor = useMemo(() => {
    const sat = getSaturday(new Date());
    return addDays(sat, weekOffset * 7);
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(saturdayAnchor, i));
  }, [saturdayAnchor]);

  const friday = weekDates[6];
  const isCurrentWeek = weekOffset === 0;

  // Determine if goals can still be set (before Monday EOD)
  const now = new Date();
  const mondayDeadline = addDays(saturdayAnchor, 2); // Monday
  mondayDeadline.setHours(23, 59, 59, 999);
  const goalsLocked = now > mondayDeadline && isCurrentWeek;

  const [goals, setGoals] = useState<WeeklyGoal[]>(
    MOCK_PPS.map((pp) => ({
      ppId: pp.id,
      gcfTarget: 5,
      coTarget: 20,
      dailyGCF: [2, 1, null, null, null, null, null],
      dailyCO: [8, 5, null, null, null, null, null],
    }))
  );

  function updateGoal(
    ppId: string,
    field: "gcfTarget" | "coTarget",
    value: number
  ) {
    setGoals(
      goals.map((g) =>
        g.ppId === ppId ? { ...g, [field]: value } : g
      )
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
          Set weekly targets and track daily results for each participant. Week
          runs Saturday to Friday.
        </p>
      </div>

      {/* Week navigation */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
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
      </div>

      {/* GCF Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Guest Confirmed (GCF)
          </CardTitle>
          <CardDescription>
            Set weekly GCF target and enter daily results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px] text-[10px] font-bold uppercase tracking-widest">
                    Participant
                  </TableHead>
                  <TableHead className="w-[80px] bg-primary/5 text-center text-[10px] font-bold uppercase tracking-widest text-primary">
                    Target
                  </TableHead>
                  {weekDates.map((date, i) => (
                    <TableHead
                      key={i}
                      className={`w-[70px] text-center text-[10px] font-bold uppercase tracking-widest ${isToday(date) ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <div>{WEEK_DAYS[i]}</div>
                      <div className="font-mono font-normal text-muted-foreground">
                        {date.getDate()}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[70px] text-center text-[10px] font-bold uppercase tracking-widest">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal) => {
                  const pp = MOCK_PPS.find((p) => p.id === goal.ppId)!;
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
                      <TableCell className="bg-primary/5 p-1.5">
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
                          className="h-8 text-center font-bold"
                        />
                      </TableCell>
                      {weekDates.map((date, i) => {
                        const canEdit =
                          isToday(date) || (isBeforeToday(date) && !isBeforeToday(addDays(date, -1)));
                        return (
                          <TableCell
                            key={i}
                            className={`p-1.5 ${isToday(date) ? "bg-primary/5" : ""}`}
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
                              className="h-8 w-14 text-center p-0"
                            />
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <span
                          className={`font-mono text-sm font-bold ${onTrack ? "text-success" : "text-warning"}`}
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

      {/* C/O Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Call Out (C/O)</CardTitle>
          <CardDescription>
            Set weekly C/O target and enter daily results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px] text-[10px] font-bold uppercase tracking-widest">
                    Participant
                  </TableHead>
                  <TableHead className="w-[80px] bg-primary/5 text-center text-[10px] font-bold uppercase tracking-widest text-primary">
                    Target
                  </TableHead>
                  {weekDates.map((date, i) => (
                    <TableHead
                      key={i}
                      className={`w-[70px] text-center text-[10px] font-bold uppercase tracking-widest ${isToday(date) ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <div>{WEEK_DAYS[i]}</div>
                      <div className="font-mono font-normal text-muted-foreground">
                        {date.getDate()}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[70px] text-center text-[10px] font-bold uppercase tracking-widest">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal) => {
                  const pp = MOCK_PPS.find((p) => p.id === goal.ppId)!;
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
                      <TableCell className="bg-primary/5 p-1.5">
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
                          className="h-8 text-center font-bold"
                        />
                      </TableCell>
                      {weekDates.map((date, i) => (
                        <TableCell
                          key={i}
                          className={`p-1.5 ${isToday(date) ? "bg-primary/5" : ""}`}
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
                            className="h-8 w-14 text-center p-0"
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <span
                          className={`font-mono text-sm font-bold ${onTrack ? "text-success" : "text-warning"}`}
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
