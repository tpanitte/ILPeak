// src/app/admin/programs/page.tsx

import Link from "next/link";
import { Plus, LayoutGrid, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramListTable } from "@/features/ILPrograms/program-list/program-list-table";

async function loadPrograms() {
  try {
    const { getProgramsList } = await import(
      "@/domain/ILPrograms/Queries/getProgramsList"
    );
    return { programs: await getProgramsList(), error: null };
  } catch (e) {
    console.error("Failed to load programs:", e);
    return { programs: [], error: "Could not connect to the database." };
  }
}

export default async function ProgramsListPage() {
  const { programs, error } = await loadPrograms();

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
            <LayoutGrid className="size-3.5" aria-hidden="true" /> Program Management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            ILP Programs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage series logistics and verify event-sourced projections.
          </p>
        </div>

        <Button asChild size="lg" className="font-semibold">
          <Link href="/admin/programs/new">
            <Plus className="size-4" aria-hidden="true" />
            Create Program
          </Link>
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-warning/30 bg-warning/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-5 text-warning" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">{error}</p>
              <p className="text-xs text-muted-foreground">
                The table below shows no data. Connect your MongoDB to see programs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* The Feature Component */}
      <ProgramListTable programs={programs} />
    </div>
  );
}
