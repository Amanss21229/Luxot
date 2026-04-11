import { Router } from "express";
import { db } from "../bot/firebase.js";

const router = Router();

function generateCode(): string {
  return "AFF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// POST /affiliate/register
router.post("/affiliate/register", async (req, res) => {
  try {
    const { name, phone, email } = req.body as { name?: string; phone?: string; email?: string };
    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      res.status(400).json({ error: "Name, phone, and email are required" });
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      res.status(400).json({ error: "Valid 10-digit phone required" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: "Valid email required" });
      return;
    }

    const phone_ = phone.trim();
    const docRef = db.collection("affiliates").doc(phone_);
    const existing = await docRef.get();

    if (existing.exists) {
      const data = existing.data()!;
      // Auto-verify if 5 min passed
      if (!data["isVerified"] && data["autoVerifyAt"]) {
        if (new Date() >= new Date(data["autoVerifyAt"] as string)) {
          await docRef.update({ isVerified: true, verifiedAt: new Date().toISOString() });
          data["isVerified"] = true;
        }
      }
      res.json({ ...data, alreadyRegistered: true });
      return;
    }

    const now = new Date();
    const autoVerifyAt = new Date(now.getTime() + 5 * 60 * 1000);

    const affiliateData = {
      phone: phone_,
      name: name.trim(),
      email: email.trim(),
      isVerified: false,
      registeredAt: now.toISOString(),
      autoVerifyAt: autoVerifyAt.toISOString(),
      earnings: 0,
      totalOrders: 0,
      totalClicks: 0,
    };

    await docRef.set(affiliateData);
    res.status(201).json(affiliateData);
    return;
  } catch {
    res.status(500).json({ error: "Failed to register" });
    return;
  }
});

// POST /affiliate/create-link
router.post("/affiliate/create-link", async (req, res) => {
  try {
    const { phone, productUrl } = req.body as { phone?: string; productUrl?: string };
    if (!phone?.trim() || !productUrl?.trim()) {
      res.status(400).json({ error: "Phone and productUrl are required" });
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      res.status(400).json({ error: "Valid 10-digit phone required" });
      return;
    }

    const phone_ = phone.trim();

    const match = productUrl.match(/\/product\/([^/?#\s]+)/);
    if (!match) {
      res.status(400).json({ error: "Invalid product URL. Use a LUXORA product page URL." });
      return;
    }
    const productId = match[1]!;

    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      res.status(404).json({ error: "Product not found. Make sure the URL is from LUXORA." });
      return;
    }
    const product = productDoc.data()!;

    const affiliateDoc = await db.collection("affiliates").doc(phone_).get();
    if (!affiliateDoc.exists) {
      res.status(403).json({ error: "Please register as an affiliate partner first (scroll down on the affiliate page)." });
      return;
    }

    const existingSnap = await db
      .collection("affiliateLinks")
      .where("affiliatePhone", "==", phone_)
      .where("productId", "==", productId)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      res.json(existingSnap.docs[0]!.data());
      return;
    }

    const linkCode = generateCode();
    const linkData = {
      linkCode,
      affiliatePhone: phone_,
      productId,
      productTitle: (product["title"] as string) ?? "Product",
      productImages: (product["images"] as string[]) ?? [],
      clicks: 0,
      orders: 0,
      earnings: 0,
      createdAt: new Date().toISOString(),
    };

    await db.collection("affiliateLinks").doc(linkCode).set(linkData);
    res.status(201).json(linkData);
    return;
  } catch {
    res.status(500).json({ error: "Failed to create affiliate link" });
    return;
  }
});

// GET /affiliate/stats?phone=XXXXXXXXXX
router.get("/affiliate/stats", async (req, res) => {
  try {
    const phone = String(req.query["phone"] ?? "").trim();
    if (!/^\d{10}$/.test(phone)) {
      res.status(400).json({ error: "Valid 10-digit phone required" });
      return;
    }

    const docRef = db.collection("affiliates").doc(phone);
    const affiliateDoc = await docRef.get();

    if (!affiliateDoc.exists) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    let affiliateData = affiliateDoc.data()!;

    if (!affiliateData["isVerified"] && affiliateData["autoVerifyAt"]) {
      if (new Date() >= new Date(affiliateData["autoVerifyAt"] as string)) {
        await docRef.update({ isVerified: true, verifiedAt: new Date().toISOString() });
        affiliateData = { ...affiliateData, isVerified: true };
      }
    }

    const linksSnap = await db
      .collection("affiliateLinks")
      .where("affiliatePhone", "==", phone)
      .orderBy("createdAt", "desc")
      .get();

    const links = linksSnap.docs.map((doc) => doc.data());

    const totalClicks = links.reduce((s, l) => s + ((l["clicks"] as number) ?? 0), 0);
    const totalOrders = links.reduce((s, l) => s + ((l["orders"] as number) ?? 0), 0);
    const totalEarnings = links.reduce((s, l) => s + ((l["earnings"] as number) ?? 0), 0);

    res.json({ affiliate: affiliateData, links, stats: { totalClicks, totalOrders, totalEarnings } });
    return;
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
    return;
  }
});

// POST /affiliate/track-click
router.post("/affiliate/track-click", async (req, res) => {
  try {
    const { linkCode } = req.body as { linkCode?: string };
    if (!linkCode?.trim()) {
      res.status(400).json({ error: "linkCode is required" });
      return;
    }

    const docRef = db.collection("affiliateLinks").doc(linkCode.trim());
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    await docRef.update({ clicks: ((doc.data()!["clicks"] as number) ?? 0) + 1 });
    res.json({ success: true });
    return;
  } catch {
    res.status(500).json({ error: "Failed to track click" });
    return;
  }
});

export default router;
