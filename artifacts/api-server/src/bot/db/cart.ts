import { db } from "../firebase.js";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  affiliateLink: string;
}

// Get user's cart
export async function getCart(userId: number): Promise<CartItem[]> {
  const doc = await db.collection("cart").doc(String(userId)).get();
  if (!doc.exists) return [];
  return (doc.data() as { items: CartItem[] }).items ?? [];
}

// Add item to cart
export async function addToCart(userId: number, item: CartItem): Promise<void> {
  const ref = db.collection("cart").doc(String(userId));
  const doc = await ref.get();
  let items: CartItem[] = [];
  if (doc.exists) {
    items = (doc.data() as { items: CartItem[] }).items ?? [];
  }
  // Avoid duplicates
  if (!items.find((i) => i.productId === item.productId)) {
    items.push(item);
    await ref.set({ items });
  }
}

// Remove item from cart
export async function removeFromCart(userId: number, productId: string): Promise<void> {
  const ref = db.collection("cart").doc(String(userId));
  const doc = await ref.get();
  if (!doc.exists) return;
  const items = ((doc.data() as { items: CartItem[] }).items ?? []).filter(
    (i) => i.productId !== productId
  );
  await ref.set({ items });
}

// Clear entire cart
export async function clearCart(userId: number): Promise<void> {
  await db.collection("cart").doc(String(userId)).set({ items: [] });
}
