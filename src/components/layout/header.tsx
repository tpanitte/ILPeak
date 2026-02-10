"use client";

import { useUser } from "@/lib/mock-auth-client";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  const { user } = useUser();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-foreground">
          Program Management
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
          {user.publicMetadata.role}
        </Badge>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
          <span className="text-sm text-muted-foreground">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
    </header>
  );
}
