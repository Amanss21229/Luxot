import { Router } from "express";
import { db } from "../bot/firebase.js";

const router = Router();

// GET /orders?phone=XXXXXXXXXX
router.get("/orders", async (req, res) => {
  try {
    const phone = String(req.query["phone"] ?? "").trim();
    if (!phone || !/^\d{10}$/.test(phone)) {
      res.status(400).json({ error: "Valid 10-digit phone number is required" });
      return;
    }

    const snap = await db
      .collection("orders")
      .where("customerPhone", "==", phone)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const orders = snap.docs.map((doc) => doc.data());
    res.json(orders);
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
    return;
  }
});

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
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
    return;
  }
});

export default router;
