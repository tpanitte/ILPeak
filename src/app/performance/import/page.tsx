import { Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ImportPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Import Data
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload CSV files for bulk performance data ingestion.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Upload className="size-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>CSV Uploader</CardTitle>
              <CardDescription>
                The CSV import feature will be available once the performance module is fully configured.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
