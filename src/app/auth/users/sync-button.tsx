// src/app/auth/users/sync-button.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/mock-auth-client";
import { syncUser } from "./actions";
import { Button } from "@/components/ui/button";

export function SyncButton() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setLoading(true);
    setError(null);

    try {
      const result = await syncUser();

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error ?? "Sync failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleSync} disabled={loading} className="w-full">
        {loading ? "Syncing..." : "Continue"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
