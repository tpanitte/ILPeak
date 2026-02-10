// src/features/Performance/import/import-wizard.tsx

import { Users, UserCheck, Mail, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // shadcn

export function ImportSummary() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-slate-900">Data Ingestion</h2>
        <Badge variant="outline" className="font-mono text-[10px] text-slate-400">
          Domain: Performance
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coach Import Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Coach Master List</h3>
              <p className="text-xs text-slate-400">Fields: ID, Name, <span className="text-blue-600 font-bold">Email</span></p>
            </div>
          </div>
        </div>

        {/* Participant Import Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Participant Roster</h3>
              <p className="text-xs text-slate-400">Fields: PP ID, Name, <span className="text-slate-900 font-bold">Coach ID</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
