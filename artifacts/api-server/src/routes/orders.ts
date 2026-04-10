import { Router } from "express";
import { db } from "../bot/firebase.js";

const router = Router();

// POST /orders
router.post("/orders", async (req, res) => {
  try {
    const { items, address, customerName, customerPhone, customerEmail, totalAmount } = req.body;

    if (!items?.length || !address || !customerName || !customerPhone) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const order = {
      orderId,
      items,
      address,
      customerName,
      customerPhone: String(customerPhone),
      customerEmail: customerEmail ?? null,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await db.collection("orders").doc(orderId).set(order);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
