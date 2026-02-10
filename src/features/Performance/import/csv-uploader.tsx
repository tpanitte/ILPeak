"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { importCoachesAction, importParticipantsAction } from "../actions";

export function CSVUploader({ type }: { type: "COACH" | "PP" }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvString = event.target?.result as string;
      try {
        const result = type === "COACH"
          ? await importCoachesAction(csvString)
          : await importParticipantsAction(csvString);

        if (result.success) {
          toast.success(`Imported ${result.count} ${type === "COACH" ? "Coaches" : "Participants"}`);
        }
      } catch (err) {
        toast.error("Import failed. Check CSV format.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isUploading}
      />
      <div className={`
        border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all
        ${isUploading ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50/30"}
      `}>
        {isUploading ? (
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        )}

        <h3 className="font-bold text-slate-900 text-lg">
          {type === "COACH" ? "Import Coaches" : "Import Participants"}
        </h3>
        <p className="text-slate-500 text-sm mt-1">Click or drag CSV file here</p>

        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <CheckCircle className="w-3 h-3 text-emerald-500" />
          UTF-8 CSV Only
        </div>
      </div>
    </div>
  );
}
