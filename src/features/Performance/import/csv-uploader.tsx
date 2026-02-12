"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSVUploaderProps {
  type: "COACH" | "PP";
  onUpload: (rows: Record<string, string>[]) => void;
}

const CSV_FIELDS: Record<string, { label: string; columns: string[] }> = {
  COACH: {
    label: "Coaches",
    columns: ["ID", "Name", "Email"],
  },
  PP: {
    label: "Participants (PP)",
    columns: ["ID", "Name", "Mobile", "Coach ID"],
  },
};

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

export function CSVUploader({ type, onUpload }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = CSV_FIELDS[type];

  async function handleFile(file: File) {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setError("CSV is empty or has no data rows.");
        return;
      }
      onUpload(rows);
      setResult({ count: rows.length });
    } catch {
      setError("Failed to parse CSV file.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) handleFile(file);
    else setError("Please upload a .csv file.");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-card/80",
        isProcessing && "pointer-events-none opacity-60"
      )}
      role="button"
      tabIndex={0}
      aria-label={`Upload ${config.label} CSV`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        disabled={isProcessing}
      />

      {isProcessing ? (
        <Loader2 className="mx-auto mb-4 size-10 animate-spin text-primary" />
      ) : result ? (
        <CheckCircle className="mx-auto mb-4 size-10 text-success" />
      ) : (
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-muted transition-transform group-hover:scale-110">
          <FileSpreadsheet className="size-6 text-primary" />
        </div>
      )}

      <h3 className="text-lg font-bold text-foreground">
        {result
          ? `${result.count} ${config.label} imported`
          : `Import ${config.label}`}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {result
          ? "Drop another file to replace"
          : "Click or drag a CSV file here"}
      </p>

      {error && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      {/* Expected columns hint */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Expected columns:
        </span>
        {config.columns.map((col) => (
          <span
            key={col}
            className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {col}
          </span>
        ))}
      </div>
    </div>
  );
}
