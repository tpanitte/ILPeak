// src/app/auth/users/actions.ts

"use server";

import { mockCurrentUser, mockClerkClient } from "@/lib/mock-auth";
import { connectAppDatabase } from "@/infra/db/mongodb";
import { UserDocument } from "@/types/db";

export async function syncUser() {
  const user = await mockCurrentUser();

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return { success: false, error: "No email found" };
  }

  const db = await connectAppDatabase();
  const UsersCollection = db.collection<UserDocument>("users");

  const now = new Date();

  try {
    const result = await UsersCollection.findOneAndUpdate(
      { _clerkID: user.id },
      {
        $set: {
          email: email,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          imageUrl: user.imageUrl,
          _updatedAt: now,
        },
        $setOnInsert: {
          _clerkID: user.id,
          role: "PARTICIPANTS",
          _createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (!result) {
      throw new Error("Database sync failed: No document returned");
    }

    if (
      user.publicMetadata.role !== result.role ||
      user.publicMetadata.uid !== result._id?.toString()
    ) {
      const clientClerk = await mockClerkClient();
      await clientClerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          uid: result._id?.toString() ?? "",
          role: result.role,
        },
      });
    }

    return {
      success: true,
      userId: result._id?.toString() ?? "",
      role: result.role,
    };
  } catch (error) {
    console.error("User Sync Error:", error);
    return { success: false, error: "Sync failed" };
  }
}
