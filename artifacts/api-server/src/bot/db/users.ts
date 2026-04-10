import { db } from "../firebase.js";
import { PERMANENT_ADMIN_IDS } from "../constants.js";

// Auto-register or fetch a user from Firestore
export async function registerUser(user: {
  userId: number;
  firstName: string;
  lastName?: string;
  username?: string;
}): Promise<void> {
  const ref = db.collection("users").doc(String(user.userId));
  const doc = await ref.get();

  if (!doc.exists) {
    await ref.set({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      joinedAt: new Date().toISOString(),
    });

    // Auto-promote permanent admins if not already in admins collection
    if (PERMANENT_ADMIN_IDS.includes(user.userId)) {
      await db
        .collection("admins")
        .doc(String(user.userId))
        .set({ userId: user.userId, addedAt: new Date().toISOString() });
    }
  }
}

// Get all registered user IDs (for broadcast)
export async function getAllUserIds(): Promise<number[]> {
  const snap = await db.collection("users").get();
  return snap.docs.map((d) => Number(d.id));
}

// Get a single user
export async function getUser(userId: number) {
  const doc = await db.collection("users").doc(String(userId)).get();
  return doc.exists ? (doc.data() as Record<string, unknown>) : null;
}
