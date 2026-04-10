import { db } from "../firebase.js";

export interface ForceJoinEntry {
  botId: string;
  groupId: string;
  channelId: string;
  enabled: boolean;
}

// Enable force join
export async function setForceJoin(botId: string, groupId: string, channelId: string): Promise<void> {
  await db.collection("force_join").doc("config").set({
    botId,
    groupId,
    channelId,
    enabled: true,
  });
}

// Disable force join
export async function removeForceJoin(): Promise<void> {
  await db.collection("force_join").doc("config").set({ enabled: false });
}

// Get current force join config
export async function getForceJoinConfig(): Promise<ForceJoinEntry | null> {
  const doc = await db.collection("force_join").doc("config").get();
  if (!doc.exists) return null;
  const data = doc.data() as ForceJoinEntry;
  return data.enabled ? data : null;
}
