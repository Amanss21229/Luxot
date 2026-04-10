import { Router } from "express";
import { db } from "../bot/firebase.js";

const router = Router();

// GET /stats
router.get("/stats", async (req, res) => {
  try {
    const [productsSnap, reviewsSnap, ordersSnap] = await Promise.all([
      db.collection("products").get(),
      db.collection("reviews").get(),
      db.collection("orders").get(),
    ]);

    const products = productsSnap.docs.map((d) => d.data() as any);
    const categories = new Set(products.map((p) => p.category)).size;

    res.json({
      totalProducts: productsSnap.size,
      totalCategories: categories,
      totalReviews: reviewsSnap.size,
      totalOrders: ordersSnap.size,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
