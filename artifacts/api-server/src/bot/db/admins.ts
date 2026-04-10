import { db } from "../firebase.js";
import { PERMANENT_ADMIN_IDS } from "../constants.js";

// Check if a user is an admin (permanent or Firestore-stored)
export async function isAdmin(userId: number): Promise<boolean> {
  if (PERMANENT_ADMIN_IDS.includes(userId)) return true;
  const doc = await db.collection("admins").doc(String(userId)).get();
  return doc.exists;
}

// Promote a user to admin
export async function promoteAdmin(userId: number): Promise<void> {
  await db
    .collection("admins")
    .doc(String(userId))
    .set({ userId, addedAt: new Date().toISOString() });
}

// Remove an admin
export async function removeAdmin(userId: number): Promise<void> {
  if (PERMANENT_ADMIN_IDS.includes(userId)) {
    throw new Error("Cannot remove a permanent admin.");
  }
  await db.collection("admins").doc(String(userId)).delete();
}

// List all admin IDs
export async function listAdmins(): Promise<number[]> {
  const snap = await db.collection("admins").get();
  return snap.docs.map((d) => Number(d.id));
}
