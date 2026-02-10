// src/lib/mock-auth.ts
// Mock authentication layer that replaces Clerk for local development.
// Provides a single "demo" user with ADMIN role so the entire app is accessible.

import "server-only";

export interface MockUser {
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

const MOCK_USER: MockUser = {
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

/**
 * Server-side: returns mock auth state (replaces Clerk's `auth()`)
 */
export async function mockAuth() {
  return {
    userId: MOCK_USER.id,
    sessionClaims: {
      uid: MOCK_USER.publicMetadata.uid,
      role: MOCK_USER.publicMetadata.role,
    },
    redirectToSignIn: () => {
      // no-op in mock mode
    },
  };
}

/**
 * Server-side: returns full mock user (replaces Clerk's `currentUser()`)
 */
export async function mockCurrentUser(): Promise<MockUser> {
  return MOCK_USER;
}

/**
 * Server-side: mock clerkClient (replaces Clerk's `clerkClient()`)
 */
export async function mockClerkClient() {
  return {
    users: {
      updateUserMetadata: async (
        _userId: string,
        _data: { publicMetadata: Record<string, unknown> }
      ) => {
        // no-op in mock mode
      },
    },
  };
}
