import { db } from "../firebase.js";

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  affiliateLink: string;  // needed for Buy Now button
}

// Get user's wishlist
export async function getWishlist(userId: number): Promise<WishlistItem[]> {
  const doc = await db.collection("wishlist").doc(String(userId)).get();
  if (!doc.exists) return [];
  return (doc.data() as { items: WishlistItem[] }).items ?? [];
}

// Add item to wishlist
export async function addToWishlist(userId: number, item: WishlistItem): Promise<void> {
  const ref = db.collection("wishlist").doc(String(userId));
  const doc = await ref.get();
  let items: WishlistItem[] = [];
  if (doc.exists) {
    items = (doc.data() as { items: WishlistItem[] }).items ?? [];
  }
  if (!items.find((i) => i.productId === item.productId)) {
    items.push(item);
    await ref.set({ items });
  }
}

// Remove item from wishlist
export async function removeFromWishlist(userId: number, productId: string): Promise<void> {
  const ref = db.collection("wishlist").doc(String(userId));
  const doc = await ref.get();
  if (!doc.exists) return;
  const items = ((doc.data() as { items: WishlistItem[] }).items ?? []).filter(
    (i) => i.productId !== productId
  );
  await ref.set({ items });
}
