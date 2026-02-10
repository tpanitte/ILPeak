import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SyncButton } from "./sync-button";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center">
        {/* Header Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-card-foreground">
          Welcome, {user.firstName || "Guest"}
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          {user.emailAddresses[0]?.emailAddress}
        </p>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Click continue to synchronize your account.
          </p>
          <SyncButton />
        </div>
      </div>
    </div>
  );
}
