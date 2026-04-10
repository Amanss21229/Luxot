import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = Router();

const KEY_ID = process.env["RAZORPAY_KEY_ID"];
const KEY_SECRET = process.env["RAZORPAY_KEY_SECRET"];

function getRazorpay() {
  if (!KEY_ID || !KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
  }
  return new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
}

router.get("/payment/config", (_req, res) => {
  res.json({ keyId: KEY_ID ?? "" });
  return;
});

router.post("/payment/create-order", async (req, res) => {
  try {
    const { amount, receipt } = req.body as { amount: number; receipt: string };

    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: receipt ?? `order_${Date.now()}`,
    });

    res.json(order);
    return;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create payment order";
    res.status(500).json({ error: msg });
    return;
  }
});

router.post("/payment/verify", (req, res) => {
  try {
    if (!KEY_SECRET) {
      res.status(503).json({ error: "Payment verification unavailable" });
      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };

    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ error: "Payment verification failed", valid: false });
      return;
    }

    res.json({ valid: true });
    return;
  } catch {
    res.status(500).json({ error: "Verification error" });
    return;
  }
});

export default router;
