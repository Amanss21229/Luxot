import { type Context } from "telegraf";
import { Markup } from "telegraf";
import { db } from "../firebase.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";
import { logger } from "../../lib/logger.js";

// Affiliate conversation state
export const affiliateState = new Map<number, { step: string; data: Record<string, string> }>();

const SITE_URL = process.env["SITE_URL"] ?? "https://luxora-web.replit.app";
const EARNINGS_PER_ORDER = 50;

function generateCode(): string {
  return "AFF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function escMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

function affiliateMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🔗 Create Affiliate Link", "aff:create")],
    [Markup.button.callback("✅ Become Verified Partner", "aff:register")],
    [Markup.button.callback("💰 Request Payment", "aff:payment")],
    [Markup.button.callback("📊 My Dashboard", "aff:dashboard")],
    [Markup.button.callback("⬅️ Back to Menu", "main_menu")],
  ]);
}

export async function handleAffiliateMenu(ctx: Context): Promise<void> {
  await ctx.reply(
    `${LUXORA_BANNER}\n\n🤝 *Affiliate Partner Program*\n\n` +
    `_Earn *₹${EARNINGS_PER_ORDER}* for every successful sale through your unique affiliate link\\!_\n\n` +
    `✅ *How it works:*\n` +
    `• Get a unique link for any LUXORA product\n` +
    `• Share it on social media, WhatsApp, etc\\.\n` +
    `• Earn ₹${EARNINGS_PER_ORDER} every time someone buys through your link\n` +
    `• Minimum 2 sales to request withdrawal\n\n` +
    `_Choose an option below:_${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
  );
}

export async function handleAffiliateCreateStart(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  affiliateState.set(userId, { step: "create:waiting_phone", data: {} });

  await ctx.editMessageText(
    `${LUXORA_BANNER}\n\n🔗 *Create Affiliate Link*\n\n` +
    `_Enter your registered *10\\-digit mobile number* to continue\\._\n\n` +
    `_\\(Not registered yet\\? Go back and choose "Become Verified Partner" first\\.\\)_${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2", ...Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back", "aff:menu")]]) }
  ).catch(() => ctx.reply(
    `🔗 *Create Affiliate Link*\n\nEnter your 10\\-digit mobile number:`,
    { parse_mode: "MarkdownV2" }
  ));
}

export async function handleAffiliateRegisterStart(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  affiliateState.set(userId, { step: "register:waiting_phone", data: {} });

  await ctx.editMessageText(
    `${LUXORA_BANNER}\n\n✅ *Become a Verified Affiliate Partner*\n\n` +
    `_You'll be auto\\-verified within 5 minutes\\._\n\n` +
    `*Step 1/3* — Enter your *10\\-digit mobile number:*${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2", ...Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back", "aff:menu")]]) }
  ).catch(() => ctx.reply(
    `✅ *Register as Affiliate*\n\nStep 1/3 — Enter your 10\\-digit mobile number:`,
    { parse_mode: "MarkdownV2" }
  ));
}

export async function handleAffiliatePayment(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  affiliateState.set(userId, { step: "payment:waiting_phone", data: {} });

  await ctx.editMessageText(
    `${LUXORA_BANNER}\n\n💰 *Request Payment*\n\n` +
    `_Enter your registered *10\\-digit mobile number* to check your earnings\\._${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2", ...Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back", "aff:menu")]]) }
  ).catch(() => ctx.reply(
    `💰 *Request Payment*\n\nEnter your 10\\-digit mobile number:`,
    { parse_mode: "MarkdownV2" }
  ));
}

export async function handleAffiliateDashboard(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  affiliateState.set(userId, { step: "dashboard:waiting_phone", data: {} });

  await ctx.editMessageText(
    `${LUXORA_BANNER}\n\n📊 *My Affiliate Dashboard*\n\n` +
    `_Enter your registered *10\\-digit mobile number:*_${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2", ...Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back", "aff:menu")]]) }
  ).catch(() => ctx.reply(
    `📊 *Dashboard*\n\nEnter your 10\\-digit mobile number:`,
    { parse_mode: "MarkdownV2" }
  ));
}

export async function handleAffiliateConversation(ctx: Context, text: string): Promise<boolean> {
  const userId = ctx.from?.id;
  if (!userId) return false;

  const state = affiliateState.get(userId);
  if (!state) return false;

  const { step, data } = state;

  // ── CREATE LINK FLOW ──
  if (step === "create:waiting_phone") {
    if (!/^\d{10}$/.test(text.trim())) {
      await ctx.reply("❌ Please enter a valid 10-digit mobile number:");
      return true;
    }
    data["phone"] = text.trim();
    affiliateState.set(userId, { step: "create:waiting_url", data });
    await ctx.reply(
      `✅ Got it\\!\n\n*Step 2* — Paste a *LUXORA product URL* from the website:\n\n_Example: ${escMd(SITE_URL)}/product/abc123_`,
      { parse_mode: "MarkdownV2" }
    );
    return true;
  }

  if (step === "create:waiting_url") {
    const match = text.match(/\/product\/([^/?#\s]+)/);
    if (!match) {
      await ctx.reply(
        `❌ Invalid URL\\. Please paste a product URL from the LUXORA website\\.\n_Example: ${escMd(SITE_URL)}/product/abc123_`,
        { parse_mode: "MarkdownV2" }
      );
      return true;
    }

    const productId = match[1]!;
    const phone = data["phone"]!;

    try {
      const productDoc = await db.collection("products").doc(productId).get();
      if (!productDoc.exists) {
        await ctx.reply("❌ Product not found. Make sure the URL is from LUXORA website.");
        affiliateState.delete(userId);
        return true;
      }
      const product = productDoc.data()!;

      const affiliateDoc = await db.collection("affiliates").doc(phone).get();
      if (!affiliateDoc.exists) {
        await ctx.reply(
          "❌ You're not registered as an affiliate yet\\. Please go back and choose *'Become Verified Partner'* first\\.",
          { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
        );
        affiliateState.delete(userId);
        return true;
      }

      const existingSnap = await db
        .collection("affiliateLinks")
        .where("affiliatePhone", "==", phone)
        .where("productId", "==", productId)
        .limit(1)
        .get();

      let linkCode: string;
      if (!existingSnap.empty) {
        linkCode = existingSnap.docs[0]!.data()["linkCode"] as string;
      } else {
        linkCode = generateCode();
        await db.collection("affiliateLinks").doc(linkCode).set({
          linkCode,
          affiliatePhone: phone,
          productId,
          productTitle: (product["title"] as string) ?? "Product",
          clicks: 0,
          orders: 0,
          earnings: 0,
          createdAt: new Date().toISOString(),
        });
      }

      const affiliateLink = `${SITE_URL}/product/${productId}?ref=${linkCode}`;

      await ctx.reply(
        `${LUXORA_BANNER}\n\n✅ *Affiliate Link Created\\!*\n\n` +
        `🛍 *Product:* ${escMd(product["title"] as string)}\n` +
        `💰 *You earn:* ₹${EARNINGS_PER_ORDER} per sale\n\n` +
        `🔗 *Your Affiliate Link:*\n\`${escMd(affiliateLink)}\`\n\n` +
        `_Copy the link above and share it\\! You earn ₹${EARNINGS_PER_ORDER} for every purchase made through it\\._${LUXORA_FOOTER}`,
        { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
      );
    } catch (err) {
      logger.error({ err }, "Failed to create affiliate link via bot");
      await ctx.reply("❌ Something went wrong. Please try again.");
    }

    affiliateState.delete(userId);
    return true;
  }

  // ── REGISTER FLOW ──
  if (step === "register:waiting_phone") {
    if (!/^\d{10}$/.test(text.trim())) {
      await ctx.reply("❌ Please enter a valid 10-digit mobile number:");
      return true;
    }
    data["phone"] = text.trim();
    affiliateState.set(userId, { step: "register:waiting_name", data });
    await ctx.reply("*Step 2/3* — Enter your *full name:*", { parse_mode: "MarkdownV2" });
    return true;
  }

  if (step === "register:waiting_name") {
    if (!text.trim()) {
      await ctx.reply("❌ Please enter your full name:");
      return true;
    }
    data["name"] = text.trim();
    affiliateState.set(userId, { step: "register:waiting_email", data });
    await ctx.reply("*Step 3/3* — Enter your *Gmail / email address:*", { parse_mode: "MarkdownV2" });
    return true;
  }

  if (step === "register:waiting_email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
      await ctx.reply("❌ Please enter a valid email address:");
      return true;
    }

    data["email"] = text.trim();
    const { phone, name, email } = data as { phone: string; name: string; email: string };

    try {
      const docRef = db.collection("affiliates").doc(phone);
      const existing = await docRef.get();

      if (existing.exists) {
        await ctx.reply(
          `${LUXORA_BANNER}\n\n✅ *Already Registered\\!*\n\n` +
          `_You're already in the LUXORA Affiliate Program\\. Use the dashboard to view your stats\\._${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
        );
        affiliateState.delete(userId);
        return true;
      }

      const now = new Date();
      const autoVerifyAt = new Date(now.getTime() + 5 * 60 * 1000);

      await docRef.set({
        phone,
        name,
        email,
        isVerified: false,
        registeredAt: now.toISOString(),
        autoVerifyAt: autoVerifyAt.toISOString(),
        earnings: 0,
        totalOrders: 0,
        totalClicks: 0,
      });

      await ctx.reply(
        `${LUXORA_BANNER}\n\n🎉 *Application Submitted\\!*\n\n` +
        `👤 *Name:* ${escMd(name)}\n` +
        `📱 *Phone:* ${escMd(phone)}\n` +
        `📧 *Email:* ${escMd(email)}\n\n` +
        `⏳ *You'll be automatically verified within 5 minutes\\.*\n\n` +
        `_Once verified, you can start creating affiliate links and earning ₹${EARNINGS_PER_ORDER} per sale\\!_${LUXORA_FOOTER}`,
        { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
      );
    } catch (err) {
      logger.error({ err }, "Failed to register affiliate via bot");
      await ctx.reply("❌ Something went wrong. Please try again.");
    }

    affiliateState.delete(userId);
    return true;
  }

  // ── PAYMENT FLOW ──
  if (step === "payment:waiting_phone") {
    if (!/^\d{10}$/.test(text.trim())) {
      await ctx.reply("❌ Please enter a valid 10-digit mobile number:");
      return true;
    }

    const phone = text.trim();
    try {
      const docRef = db.collection("affiliates").doc(phone);
      const affiliateDoc = await docRef.get();

      if (!affiliateDoc.exists) {
        await ctx.reply(
          "❌ No affiliate account found for this number\\. Please register first\\.",
          { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
        );
        affiliateState.delete(userId);
        return true;
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
        .get();

      const links = linksSnap.docs.map((d) => d.data());
      const totalOrders = links.reduce((s, l) => s + ((l["orders"] as number) ?? 0), 0);
      const totalEarnings = links.reduce((s, l) => s + ((l["earnings"] as number) ?? 0), 0);

      if (!affiliateData["isVerified"]) {
        await ctx.reply(
          `${LUXORA_BANNER}\n\n⏳ *Verification Pending*\n\n` +
          `_Your account is being verified\\. Please wait up to 5 minutes after registration\\._${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
        );
        affiliateState.delete(userId);
        return true;
      }

      if (totalOrders < 2) {
        await ctx.reply(
          `${LUXORA_BANNER}\n\n💰 *Payment Request*\n\n` +
          `📊 *Your Stats:*\n` +
          `• Total Sales: ${totalOrders}\n` +
          `• Total Earnings: ₹${totalEarnings}\n\n` +
          `⚠️ *Minimum 2 successful sales required to request payment\\.*\n` +
          `_You need ${2 - totalOrders} more sale${2 - totalOrders > 1 ? "s" : ""}\\._${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
        );
        affiliateState.delete(userId);
        return true;
      }

      await ctx.reply(
        `${LUXORA_BANNER}\n\n✅ *Payment Request*\n\n` +
        `📊 *Your Stats:*\n` +
        `• Total Sales: ${totalOrders}\n` +
        `• Total Earnings: ₹${totalEarnings}\n\n` +
        `_Click below to send your payment request email\\. Include your phone number and UPI ID in the email\\._${LUXORA_FOOTER}`,
        {
          parse_mode: "MarkdownV2",
          ...Markup.inlineKeyboard([
            [Markup.button.url("📧 Request Payment via Email", "mailto:contact.sansafeel@gmail.com")],
            [Markup.button.callback("⬅️ Back", "aff:menu")],
          ]),
        }
      );
    } catch (err) {
      logger.error({ err }, "Failed to check payment eligibility via bot");
      await ctx.reply("❌ Something went wrong. Please try again.");
    }

    affiliateState.delete(userId);
    return true;
  }

  // ── DASHBOARD FLOW ──
  if (step === "dashboard:waiting_phone") {
    if (!/^\d{10}$/.test(text.trim())) {
      await ctx.reply("❌ Please enter a valid 10-digit mobile number:");
      return true;
    }

    const phone = text.trim();
    try {
      const docRef = db.collection("affiliates").doc(phone);
      const affiliateDoc = await docRef.get();

      if (!affiliateDoc.exists) {
        await ctx.reply(
          "❌ No affiliate account found\\. Please register first\\.",
          { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() }
        );
        affiliateState.delete(userId);
        return true;
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

      const links = linksSnap.docs.map((d) => d.data());
      const totalClicks = links.reduce((s, l) => s + ((l["clicks"] as number) ?? 0), 0);
      const totalOrders = links.reduce((s, l) => s + ((l["orders"] as number) ?? 0), 0);
      const totalEarnings = links.reduce((s, l) => s + ((l["earnings"] as number) ?? 0), 0);

      const statusBadge = affiliateData["isVerified"] ? "✅ Verified" : "⏳ Pending Verification";

      let msg = `${LUXORA_BANNER}\n\n📊 *Affiliate Dashboard*\n\n` +
        `👤 *${escMd(affiliateData["name"] as string)}*  ${statusBadge}\n` +
        `📱 ${escMd(phone)}\n\n` +
        `📈 *Overall Stats:*\n` +
        `• 🖱 Total Clicks: ${totalClicks}\n` +
        `• 📦 Total Orders: ${totalOrders}\n` +
        `• 💰 Total Earnings: ₹${totalEarnings}\n\n`;

      if (links.length > 0) {
        msg += `🔗 *Your Affiliate Links \\(${links.length}\\):*\n`;
        links.slice(0, 5).forEach((link, i) => {
          const affiliateLink = `${SITE_URL}/product/${link["productId"]}?ref=${link["linkCode"]}`;
          msg += `\n*${i + 1}\\.* ${escMd(link["productTitle"] as string)}\n` +
            `   🖱 ${link["clicks"]} clicks · 📦 ${link["orders"]} orders · ₹${link["earnings"]} earned\n` +
            `   🔗 \`${escMd(affiliateLink)}\`\n`;
        });
        if (links.length > 5) {
          msg += `\n_\\.\\.\\. and ${links.length - 5} more links\\. Visit the website for full dashboard\\._\n`;
        }
      } else {
        msg += `_No affiliate links yet\\. Create your first link\\!_\n`;
      }

      msg += LUXORA_FOOTER;

      await ctx.reply(msg, { parse_mode: "MarkdownV2", ...affiliateMenuKeyboard() });
    } catch (err) {
      logger.error({ err }, "Failed to load dashboard via bot");
      await ctx.reply("❌ Something went wrong. Please try again.");
    }

    affiliateState.delete(userId);
    return true;
  }

  return false;
}
