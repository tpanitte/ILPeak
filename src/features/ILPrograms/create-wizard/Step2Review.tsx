"use client";

import { useState } from "react";
import { format, addDays, getDay } from "date-fns";
import { th } from "date-fns/locale"; // Optional: Use Thai locale if needed
import { CalendarIcon, Check, ChevronLeft, Trash2, Plus, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
// Ensure this path matches your project structure
import { ProgramSession } from "@/features/ILPrograms/schema"; 

interface Step2Props {
  sessions: ProgramSession[];
  isSubmitting: boolean;
  onCreate: (finalSessions: ProgramSession[]) => void;
  onBack: () => void;
}

export function Step2Review({ sessions: initialSessions, onCreate, onBack, isSubmitting }: Step2Props) {
  const [sessions, setSessions] = useState<ProgramSession[]>(initialSessions);

  // --- 1. Handle Date Change ---
  const handleDateChange = (id: string, newDate: Date) => {
    setSessions((prev) => {
      const updated = prev.map((s) => 
        s.id === id ? { ...s, date: newDate } : s
      );
      // Re-sort chronologically after change to keep the list valid
      return updated.sort((a, b) => a.date.getTime() - b.date.getTime());
    });
  };

  // --- 2. Smart Delete & Append Logic ---
  const handleDelete = (id: string) => {
    const sessionToDelete = sessions.find(s => s.id === id);
    if (!sessionToDelete) return;

    // A. Remove the clicked session
    const remaining = sessions.filter(s => s.id !== id);

    // B. Logic: If it was a CLASSROOM, we must maintain the total count.
    //    We append a new session at the end of the schedule.
    let newSessionList = [...remaining];

    if (sessionToDelete.type === 'CLASSROOM') {
       // 1. Find the very last session date in the current schedule
       const lastSession = newSessionList[newSessionList.length - 1];
       const lastDate = lastSession ? lastSession.date : new Date();

       // 2. Calculate the next occurrence of the *same weekday* as the deleted one.
       //    (e.g., If I delete a Thursday, I likely want a new Thursday at the end)
       const targetDay = getDay(sessionToDelete.date);
       let nextDate = addDays(lastDate, 1);

       // Keep adding days until we hit the target weekday
       // (Safety counter to prevent infinite loops)
       let safety = 0;
       while (getDay(nextDate) !== targetDay && safety < 14) {
         nextDate = addDays(nextDate, 1);
         safety++;
       }

       // 3. Create the new replacement session
       const replacement: ProgramSession = {
         id: crypto.randomUUID(),
         date: nextDate,
         type: 'CLASSROOM',
         name: 'New Session', // Placeholder, will be renamed below
         index: 0
       };
       newSessionList.push(replacement);
    }

    // C. Sort everything by date
    newSessionList.sort((a, b) => a.date.getTime() - b.date.getTime());

    // D. Re-Index "Classroom X" names 
    //    (Ensures "Classroom 5" becomes "Classroom 4" if #3 was deleted)
    let classroomCounter = 1;
    newSessionList = newSessionList.map(s => {
      if (s.type === 'CLASSROOM') {
        const newName = `Classroom ${classroomCounter}`;
        classroomCounter++;
        return { ...s, name: newName, index: classroomCounter };
      }
      return s;
    });

    setSessions(newSessionList);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl border p-0 rounded-xl bg-card shadow-sm overflow-hidden">
      
      {/* Header Panel */}
      <div className="p-6 border-b bg-muted/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" /> 
            Step 2: Review Schedule
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review dates below. Deleting a <strong>Classroom</strong> will automatically add a makeup class at the end.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={() => onCreate(sessions)} disabled={isSubmitting} className="px-6">
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" /> Confirm & Create
              </>
            )}
          </Button>
        </div>
      </div>

      {/* List / Table View */}
      <div className="bg-white dark:bg-zinc-950">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b text-xs font-semibold uppercase text-muted-foreground tracking-wider bg-muted/20">
          <div className="col-span-4 md:col-span-3">Session Name</div>
          <div className="col-span-3 md:col-span-2">Date</div>
          <div className="col-span-3 md:col-span-2">Day</div>
          <div className="col-span-0 md:col-span-3 hidden md:block">Time</div>
          <div className="col-span-2 md:col-span-2 text-right">Action</div>
        </div>

        <ScrollArea className="h-[600px] w-full">
          <div className="divide-y">
            {sessions.map((session) => {
              // Visual Logic based on image provided
              const isWeekend = session.type === 'WEEKEND';
              const isPreClass = session.type === 'PRE_CLASS';
              
              // Styling classes
              const rowClass = cn(
                "grid grid-cols-12 gap-4 px-6 py-3 items-center text-sm transition-colors hover:bg-muted/30",
                isWeekend ? "bg-blue-50/80 dark:bg-blue-900/10" : "", // Blue rows for weekends
                isPreClass ? "bg-indigo-50/80 dark:bg-indigo-900/10" : ""
              );

              const textClass = cn(
                "font-medium",
                isWeekend ? "text-blue-700 dark:text-blue-300" : "text-foreground"
              );

              return (
                <div key={session.id} className={rowClass}>
                  
                  {/* Column 1: Name */}
                  <div className={`col-span-4 md:col-span-3 ${textClass}`}>
                    {session.name}
                  </div>

                  {/* Column 2: Date Picker */}
                  <div className="col-span-3 md:col-span-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-left hover:underline decoration-dashed underline-offset-4 decoration-muted-foreground/50">
                          {format(session.date, "d MMM")} 
                          <span className="text-muted-foreground/50 ml-1 text-xs hidden sm:inline">
                             '{format(session.date, "yy")}
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={session.date}
                          onSelect={(d) => d && handleDateChange(session.id, d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Column 3: Day Name */}
                  <div className="col-span-3 md:col-span-2 text-muted-foreground">
                    {format(session.date, "EEEE")}
                  </div>

                  {/* Column 4: Time (Static for now, per image logic) */}
                  <div className="col-span-0 md:col-span-3 hidden md:block text-xs text-muted-foreground font-mono">
                    {isWeekend ? (
                        format(session.date, "EEEE") === "Sunday" ? "09:00 - 19:00" : "09:00 - 23:00"
                    ) : (
                        "19:00 - 23:00"
                    )}
                  </div>

                  {/* Column 5: Action (Delete) */}
                  <div className="col-span-2 md:col-span-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(session.id)}
                      title="Remove this week (Holiday)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer - Add Manual Session (Optional) */}
          <div className="p-4 border-t bg-muted/5 flex justify-center">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
               <ArrowRight className="w-3 h-3" />
               Deleting a session automatically appends a makeup class to the end.
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
