// src/lib/mock-auth-client.tsx
// Client-side mock that replaces @clerk/nextjs components and hooks.
"use client";

import React from "react";

const MOCK_USER = {
  id: "mock_user_001",
  firstName: "Dev",
  lastName: "User",
  fullName: "Dev User",
  emailAddresses: [{ emailAddress: "dev@ilpeak.test" }],
  imageUrl: "",
  publicMetadata: {
    uid: "mock_uid_001",
    role: "ADMIN",
  },
};

/** Replaces ClerkProvider - just passes children through */
export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Replaces useUser() from @clerk/nextjs */
export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: MOCK_USER,
  };
}

/** Replaces useAuth() from @clerk/nextjs */
export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: MOCK_USER.id,
    sessionId: "mock_session_001",
    getToken: async () => "mock_token",
  };
}
