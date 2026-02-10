// Mock middleware - allows all routes through since auth is mocked.
// Original Clerk middleware is preserved in comments for reference.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(_req: NextRequest) {
  // In mock auth mode, all routes are accessible.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
