import { Router } from "express";
import { db } from "../bot/firebase.js";

const router = Router();

// GET /digital-products
router.get("/digital-products", async (req, res) => {
  try {
    const snap = await db.collection("digitalProducts").get();
    const products = snap.docs
      .map((d) => d.data())
      .sort((a: any, b: any) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch digital products" });
  }
});

export default router;
