import { ObjectId } from "mongodb";
import { UserRole } from "./globals";

// The structure of our User in MongoDB
export interface UserDocument {
  _id?: ObjectId;
  _clerkID: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  _createdAt: Date;
  _updatedAt: Date;
}
