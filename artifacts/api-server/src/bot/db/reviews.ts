import { db } from "../firebase.js";
import { updateProductRating } from "./products.js";

export interface Review {
  userId: number;
  productId: string;
  rating: number;
  createdAt: string;
}

// Submit or update a review
export async function submitReview(userId: number, productId: string, rating: number): Promise<void> {
  const reviewId = `${userId}_${productId}`;
  await db.collection("reviews").doc(reviewId).set({
    userId,
    productId,
    rating,
    createdAt: new Date().toISOString(),
  });

  // Recalculate average rating for the product
  const snap = await db
    .collection("reviews")
    .where("productId", "==", productId)
    .get();

  const reviews = snap.docs.map((d) => d.data() as Review);
  const total = reviews.length;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  await updateProductRating(productId, Math.round(avg * 10) / 10, total);
}

// Get reviews for a product
export async function getProductReviews(productId: string): Promise<Review[]> {
  const snap = await db
    .collection("reviews")
    .where("productId", "==", productId)
    .get();
  return snap.docs.map((d) => d.data() as Review);
}
