import { db } from "../firebase.js";

export interface DigitalProduct {
  productId: string;
  title: string;
  price: number;
  description: string;
  fileLink?: string;
  createdAt?: string;
}

// Add a digital product
export async function addDigitalProduct(
  product: Omit<DigitalProduct, "productId" | "createdAt">
): Promise<string> {
  const ref = db.collection("digital_products").doc();
  const productId = ref.id;
  await ref.set({
    ...product,
    productId,
    createdAt: new Date().toISOString(),
  });
  return productId;
}

// Get all digital products — sorted in memory
export async function getAllDigitalProducts(): Promise<DigitalProduct[]> {
  const snap = await db.collection("digital_products").get();
  return snap.docs
    .map((d) => d.data() as DigitalProduct)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

// Get a single digital product
export async function getDigitalProduct(productId: string): Promise<DigitalProduct | null> {
  const doc = await db.collection("digital_products").doc(productId).get();
  return doc.exists ? (doc.data() as DigitalProduct) : null;
}

// Delete a digital product
export async function deleteDigitalProduct(productId: string): Promise<void> {
  await db.collection("digital_products").doc(productId).delete();
}
