import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SyncButton } from "./sync-button";

export default async function Page() {
  // 1. Get auth state first (lighter request than currentUser)
  const { userId, redirectToSignIn } = await auth();

  // 2. If not logged in, use Clerk's helper to go to Hosted Page
  if (!userId) {
    return redirectToSignIn(); // <--- This fixes your issue
  }

  // 3. Fetch full user data for the UI
  const user = await currentUser();
  console.log("Fetched current user:", user);

  // Safety fallback: If auth() says yes but data fetch fails
  if (!user) {
    return redirectToSignIn();
  }

  console.log("User data3333:", user);
  /*
  // 4. If the user ALREADY has metadata, send them to Application
  // This prevents users from getting stuck on this page if they hit "Back"
  if (user.publicMetadata?.uid) {
    redirect("/");
  }
    */

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">

        {/* Header Icon or Logo */}
        <div className="mb-6 flex justify-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
            {/* Simple User Icon */}
            <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-slate-900">
          Welcome, {user.firstName || "Guest"}
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          {user.emailAddresses[0]?.emailAddress}
        </p>

        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Click continue to synchronize your account.
          </p>
          <SyncButton />
        </div>
      </div>
    </div>
  );
}
