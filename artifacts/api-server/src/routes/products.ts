import { Router } from "express";
import { db } from "../bot/firebase.js";
import type { Product } from "../bot/db/products.js";

const router = Router();

// GET /products
router.get("/products", async (req, res) => {
  try {
    const { category, search, limit } = req.query as {
      category?: string;
      search?: string;
      limit?: string;
    };
    const snap = await db.collection("products").get();
    let products = snap.docs
      .map((d) => d.data() as Product)
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (search) {
      const lower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower)
      );
    }

    const maxLimit = limit ? Math.min(parseInt(limit, 10), 200) : 50;
    products = products.slice(0, maxLimit);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /products/trending
router.get("/products/trending", async (req, res) => {
  try {
    const { limit } = req.query as { limit?: string };
    const snap = await db.collection("products").get();
    const products = snap.docs
      .map((d) => d.data() as Product)
      .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
      .slice(0, limit ? Math.min(parseInt(limit, 10), 50) : 10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
});

// GET /products/featured
router.get("/products/featured", async (req, res) => {
  try {
    const snap = await db.collection("products").get();
    const products = snap.docs.map((d) => d.data() as Product);

    // Featured = high rating OR newest, up to 12
    const featured = products
      .filter((p) => p.images && p.images.length > 0)
      .sort((a, b) => {
        const ratingScore = ((b.rating ?? 0) - (a.rating ?? 0)) * 0.6;
        const dateScore =
          (b.createdAt ?? "").localeCompare(a.createdAt ?? "") * 0.4;
        return ratingScore + dateScore;
      })
      .slice(0, 12);

    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

// GET /products/:productId
router.get("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const doc = await db.collection("products").doc(productId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(doc.data());
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
    return;
  }
});

// GET /products/:productId/reviews
router.get("/products/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;
    const snap = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .get();
    const reviews = snap.docs
      .map((d) => d.data())
      .sort((a: any, b: any) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /products/:productId/reviews
router.post("/products/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating } = req.body as { userId: number; rating: number };

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid review data" });
    }

    const reviewData = {
      userId,
      productId,
      rating,
      createdAt: new Date().toISOString(),
    };

    await db.collection("reviews").add(reviewData);

    // Recalculate product rating
    const allReviews = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .get();
    const ratings = allReviews.docs.map((d) => (d.data() as any).rating as number);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    await db.collection("products").doc(productId).update({
      rating: parseFloat(avg.toFixed(1)),
      totalReviews: ratings.length,
    });

    res.json(reviewData);
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
    return;
  }
});

export default router;
