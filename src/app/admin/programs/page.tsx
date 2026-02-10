// src/app/admin/programs/page.tsx

import Link from "next/link";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramsList } from "@/domain/ILPrograms/Queries/getProgramsList";
import { ProgramListTable } from "@/features/ILPrograms/program-list/program-list-table";

export default async function ProgramsListPage() {
  const programs = await getProgramsList();

  return (
    <div className="min-h-screen bg-slate-50/40">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        
        {/* Header Section: Balanced Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-2">
              <LayoutGrid className="w-3.5 h-3.5" /> Program Management
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              ILP Programs
            </h1>
            <p className="text-slate-500 text-lg font-medium mt-2">
              Manage series logistics and verify event-sourced projections.
            </p>
          </div>
          
          <Button asChild size="lg" className="px-6 font-bold shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95 transition-all">
            <Link href="/admin/programs/new">
              <Plus className="w-5 h-5 mr-2" />
              Create Program
            </Link>
          </Button>
        </div>

        {/* The Feature Component */}
        <ProgramListTable programs={programs} />
      </div>
    </div>
  );
}
