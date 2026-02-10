"use client";

import { useState } from "react";
import { CSVUploader } from "@/features/Performance/import/csv-uploader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload } from "lucide-react";

interface Coach {
  "Coach ID": string;
  "Coach Name": string;
  "Coach Email": string;
}

interface Participant {
  "PP ID": string;
  "PP Name": string;
  "PP Mobile": string;
  "Coach ID": string;
}

export default function ImportPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  function handleCoachUpload(rows: Record<string, string>[]) {
    setCoaches(rows as unknown as Coach[]);
  }

  function handleParticipantUpload(rows: Record<string, string>[]) {
    setParticipants(rows as unknown as Participant[]);
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Import Data
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload CSV files to import Coaches and Participants into the system.
        </p>
      </div>

      {/* Upload Zones */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CSVUploader type="COACH" onUpload={handleCoachUpload} />
        <CSVUploader type="PP" onUpload={handleParticipantUpload} />
      </div>

      {/* Coaches Preview */}
      {coaches.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Coaches Preview</CardTitle>
                <CardDescription>
                  {coaches.length} coach{coaches.length !== 1 ? "es" : ""}{" "}
                  parsed from CSV
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                <CheckCircle className="mr-1 size-3" />
                Ready
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      Coach ID
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      Name
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      Email
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.slice(0, 20).map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">
                        {c["Coach ID"]}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {c["Coach Name"]}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c["Coach Email"]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {coaches.length > 20 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Showing 20 of {coaches.length} coaches.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Participants Preview */}
      {participants.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Participants Preview
                </CardTitle>
                <CardDescription>
                  {participants.length} participant
                  {participants.length !== 1 ? "s" : ""} parsed from CSV
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                <CheckCircle className="mr-1 size-3" />
                Ready
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      PP ID
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      Name
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      Mobile
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                      Coach ID
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.slice(0, 20).map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">
                        {p["PP ID"]}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {p["PP Name"]}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p["PP Mobile"]}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {p["Coach ID"]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {participants.length > 20 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Showing 20 of {participants.length} participants.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save button */}
      {(coaches.length > 0 || participants.length > 0) && (
        <div className="flex justify-end">
          <Button size="lg">
            <Upload className="mr-2 size-4" />
            Save Imported Data
          </Button>
        </div>
      )}
    </div>
  );
}
