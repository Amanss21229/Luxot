import { Router } from "express";
import { db } from "../bot/firebase.js";
import type { Product } from "../bot/db/products.js";

const router = Router();

const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  electronics: { name: "Electronics", icon: "📱" },
  fashion: { name: "Fashion", icon: "👗" },
  shoes: { name: "Shoes", icon: "👟" },
  gadgets: { name: "Gadgets", icon: "🔧" },
  stationery: { name: "Stationery", icon: "📝" },
  home: { name: "Home & Living", icon: "🏠" },
  accessories: { name: "Accessories", icon: "💎" },
  digital: { name: "Digital Store", icon: "🎓" },
};

// GET /categories
router.get("/categories", async (req, res) => {
  try {
    const snap = await db.collection("products").get();
    const products = snap.docs.map((d) => d.data() as Product);

    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }

    const categories = Object.entries(CATEGORY_META).map(([id, meta]) => ({
      id,
      name: meta.name,
      icon: meta.icon,
      productCount: counts[id] ?? 0,
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
