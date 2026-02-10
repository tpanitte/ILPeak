// src/features/Performance/dashboard/daily-tracker.tsx

import { format, addDays } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export function SaturdayToFridayTable({ participants }: { participants: any[] }) {
  // Logic: Calculate current Saturday anchor
  const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            <TableHead className="px-6 py-4 w-[200px]">Participant</TableHead>
            <TableHead className="px-4 text-center bg-blue-50/50 text-blue-600">Target</TableHead>
            {weekDays.map(day => (
              <TableHead key={day} className="px-2 text-center">{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map(p => (
            <TableRow key={p.id} className="hover:bg-slate-50/30">
              <TableCell className="px-6 py-4">
                <div className="font-bold text-slate-900">{p.name}</div>
                <div className="text-[10px] text-slate-400 font-mono italic">Coach: {p.coachID}</div>
              </TableCell>
              
              {/* Coach sets weekly target */}
              <TableCell className="p-2 bg-blue-50/20">
                <Input className="h-8 text-center font-bold border-blue-100" placeholder="0" />
              </TableCell>

              {/* Coach sets daily results */}
              {weekDays.map(day => (
                <TableCell key={day} className="p-2">
                  <Input className="h-8 w-10 mx-auto text-center border-slate-100 p-0" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
