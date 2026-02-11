// src/lib/mock-auth.ts
// Server-side mock that replaces @clerk/nextjs/server functions.
// Provides a deterministic mock user for development/preview.

const MOCK_USER_ID = "mock_user_001";

const MOCK_USER = {
  id: MOCK_USER_ID,
  firstName: "Dev",
  lastName: "User",
  emailAddresses: [{ emailAddress: "dev@ilpeak.test" }],
  imageUrl: "",
  publicMetadata: {
    uid: "mock_uid_001",
    role: "ADMIN" as string,
  },
};

/** Replaces `auth()` from @clerk/nextjs/server */
export async function mockAuth() {
  return {
    userId: MOCK_USER_ID,
    sessionClaims: {
      uid: MOCK_USER.publicMetadata.uid,
      role: MOCK_USER.publicMetadata.role,
    },
    redirectToSignIn: () => {
      throw new Error("Mock auth: redirectToSignIn called");
    },
  };
}

/** Replaces `currentUser()` from @clerk/nextjs/server */
export async function mockCurrentUser() {
  return MOCK_USER;
}

/** Replaces `clerkClient()` from @clerk/nextjs/server */
export async function mockClerkClient() {
  return {
    users: {
      updateUserMetadata: async (
        _userId: string,
        _params: { publicMetadata: Record<string, string> }
      ) => {
        // No-op in mock mode. In production Clerk updates user metadata.
        return;
      },
    },
  };
}
