import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

const isUsersMappingRoute = createRouteMatcher(["/auth/users"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // 1. Allow Public Routes immediately
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Handle Unauthenticated users
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 3. Allow Users Mapping routes
  if (isUsersMappingRoute(req)) {
    return NextResponse.next();
  }

  // 4. Protect Admin routes
  if (isAdminRoute(req)) {
    return NextResponse.next();
  }

  // 5. Profile Sync routes
  if (!sessionClaims?.uid || !sessionClaims?.role) {
    const usersMappingUrl = new URL("/auth/users", req.url);
    return NextResponse.redirect(usersMappingUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
