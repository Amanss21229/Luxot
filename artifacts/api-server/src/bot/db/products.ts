import { db } from "../firebase.js";

export interface Product {
  productId: string;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];      // Array of image file_ids or URLs (max 5)
  video?: string;        // Optional video file_id
  affiliateLink: string;
  clicks?: number;
  rating?: number;
  totalReviews?: number;
  createdAt?: string;
}

// Add a new product
export async function addProduct(product: Omit<Product, "productId" | "clicks" | "createdAt">): Promise<string> {
  const ref = db.collection("products").doc();
  const productId = ref.id;
  await ref.set({
    ...product,
    productId,
    clicks: 0,
    createdAt: new Date().toISOString(),
  });
  return productId;
}

// Get all products — no compound index needed
export async function getAllProducts(): Promise<Product[]> {
  const snap = await db.collection("products").get();
  return snap.docs
    .map((d) => d.data() as Product)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

// Get products by category — filter in memory to avoid composite index requirement
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

// Get a single product by ID
export async function getProduct(productId: string): Promise<Product | null> {
  const doc = await db.collection("products").doc(productId).get();
  return doc.exists ? (doc.data() as Product) : null;
}

// Update a product
export async function updateProduct(productId: string, data: Partial<Product>): Promise<void> {
  await db.collection("products").doc(productId).update(data as Record<string, unknown>);
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  await db.collection("products").doc(productId).delete();
}

// Increment click count for trending
export async function incrementClick(productId: string): Promise<void> {
  const ref = db.collection("products").doc(productId);
  const doc = await ref.get();
  if (doc.exists) {
    const current = (doc.data() as Product).clicks ?? 0;
    await ref.update({ clicks: current + 1 });

    // Also update clicks collection for separate tracking
    await db.collection("clicks").doc(productId).set(
      { productId, clicks: current + 1 },
      { merge: true }
    );
  }
}

// Get trending products (top by clicks) — sorted in memory
export async function getTrendingProducts(limit = 10): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
    .slice(0, limit);
}

// Search products by title keyword
export async function searchProducts(keyword: string): Promise<Product[]> {
  const all = await getAllProducts();
  const lower = keyword.toLowerCase();
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
}

// Update product rating after a new review
export async function updateProductRating(productId: string, newRating: number, totalReviews: number): Promise<void> {
  await db.collection("products").doc(productId).update({
    rating: newRating,
    totalReviews,
  });
}
