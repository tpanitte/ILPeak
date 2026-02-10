// src/features/ILPrograms/program-list/program-list-table.tsx

"use client";

import * as React from "react";
import { format, isAfter, isBefore } from "date-fns";
import { ChevronRight, MoreHorizontal, Search, Calendar, Clock, Hash } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export function ProgramListTable({ programs }: { programs: any[] }) {
  // Logic: Map dates to status for the Badge
  const getStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isBefore(now, startDate)) return { label: "Upcoming", className: "bg-amber-50 text-amber-700 border-amber-100" };
    if (isAfter(now, endDate)) return { label: "Completed", className: "bg-slate-100 text-slate-600 border-slate-200" };
    return { label: "Success", className: "bg-emerald-50 text-emerald-700 border-emerald-100" };
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Toolbar matching Radix ref */}
      <div className="flex items-center justify-between py-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Filter programs..." className="pl-10 bg-white border-slate-200" />
        </div>
        <Button variant="outline" size="sm" className="ml-auto font-bold text-slate-600">
          Columns
        </Button>
      </div>

      {/* Main Table Segment */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] px-6"><Checkbox disabled /></TableHead>
              <TableHead className="px-6 text-[11px] font-bold uppercase text-slate-400 tracking-widest">Status</TableHead>
              <TableHead className="px-6 text-[11px] font-bold uppercase text-slate-400 tracking-widest">Program Details</TableHead>
              <TableHead className="px-6 text-[11px] font-bold uppercase text-slate-400 tracking-widest hidden md:table-cell">Schedule</TableHead>
              <TableHead className="px-6 text-[11px] font-bold uppercase text-slate-400 tracking-widest text-right">Sync Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((p) => {
              const status = getStatus(p.startDate, p.endDate);
              return (
                <TableRow key={p._id} className="group transition-colors hover:bg-slate-50/50">
                  <TableCell className="px-6"><Checkbox /></TableCell>
                  <TableCell className="px-6">
                    <Badge variant="outline" className={`rounded-md font-bold text-[10px] px-2 py-0.5 border-none shadow-sm ${status.className}`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-4">
                      {/* Serie Avatar */}
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-slate-200">
                        {p.serie}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-base">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                          <Hash className="w-3 h-3" /> {p._id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        {p.classroomDay} Class
                        <span className="text-[10px] text-slate-300 font-normal">|</span>
                        <span className="text-[10px] uppercase font-black text-blue-600">{p.totalSessions} Sessions</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(p.startDate), "dd MMM")}</span>
                        <span className="flex items-center gap-1 text-slate-300 underline decoration-slate-200"><Clock className="w-3 h-3" /> 19:00</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    {/* Visualizing Eventual Consistency Version */}
                    <Badge variant="outline" className="font-mono text-[9px] text-slate-400 border-slate-100 bg-slate-50">
                      V_{p._version}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-600 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs uppercase text-slate-400 tracking-widest">Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild className="cursor-pointer font-medium">
                            <Link href={`/admin/programs/${p._id}`}>View Schedule</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-medium">Edit Configuration</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Segment */}
      <div className="flex items-center justify-between px-2 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <div>0 of {programs.length} selected.</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-4" disabled>Prev</Button>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold px-4" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
