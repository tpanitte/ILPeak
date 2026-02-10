// src/lib/mock-auth-client.tsx
// Client-side mock auth provider and hooks that replace Clerk's React components and hooks.

"use client";

import React, { createContext, useContext, useCallback } from "react";

interface MockUserState {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
  publicMetadata: {
    uid?: string;
    role?: string;
  };
}

interface MockAuthContextValue {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: MockUserState | null;
}

const MOCK_USER: MockUserState = {
  id: "mock_user_001",
  firstName: "Demo",
  lastName: "Admin",
  emailAddresses: [{ emailAddress: "demo@ilpeak.dev" }],
  imageUrl: "",
  publicMetadata: {
    uid: "mock_uid_001",
    role: "ADMIN",
  },
};

const MockAuthContext = createContext<MockAuthContextValue>({
  isSignedIn: true,
  isLoaded: true,
  user: MOCK_USER,
});

/**
 * Replaces ClerkProvider - wraps children with mock auth context
 */
export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <MockAuthContext.Provider
      value={{ isSignedIn: true, isLoaded: true, user: MOCK_USER }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

/**
 * Replaces useUser from @clerk/nextjs
 */
export function useUser() {
  const ctx = useContext(MockAuthContext);
  return {
    isSignedIn: ctx.isSignedIn,
    isLoaded: ctx.isLoaded,
    user: ctx.user,
  };
}

/**
 * Replaces useAuth from @clerk/nextjs
 */
export function useAuth() {
  const ctx = useContext(MockAuthContext);
  return {
    isSignedIn: ctx.isSignedIn,
    isLoaded: ctx.isLoaded,
    userId: ctx.user?.id ?? null,
  };
}

/**
 * Replaces SignedIn - renders children when "signed in" (always in mock mode)
 */
export function SignedIn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Replaces SignedOut - renders children when "signed out" (never in mock mode)
 */
export function SignedOut({ children }: { children: React.ReactNode }) {
  return null;
}

/**
 * Replaces UserButton - shows a simple user avatar/badge
 */
export function UserButton() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        DA
      </div>
      <span className="hidden sm:inline">Demo Admin</span>
    </div>
  );
}

/**
 * Replaces SignInButton - renders a disabled button in mock mode
 */
export function SignInButton({ children }: { children?: React.ReactNode }) {
  return <>{children ?? <button disabled>Sign In</button>}</>;
}

/**
 * Replaces SignUpButton - renders a disabled button in mock mode
 */
export function SignUpButton({ children }: { children?: React.ReactNode }) {
  return <>{children ?? <button disabled>Sign Up</button>}</>;
}
