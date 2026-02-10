export {};

export type UserRole = "ADMIN" | "HEAD_COACHES" | "COACH_LEADERS" | "COACHES" | "PARTICIPANTS";

declare global {
  interface UserPublicMetadata {
    uid?: string;
    role?: UserRole;
  }

  interface CustomJwtSessionClaims {
    uid?: string;
    role?: UserRole;
  }
}
