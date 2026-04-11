import { Telegraf, type Context } from "telegraf";
import { message } from "telegraf/filters";
import { logger } from "../lib/logger.js";

// Handlers
import { handleStart } from "./handlers/start.js";
import { handleShop, handleCategory, handleProductNav } from "./handlers/shop.js";
import { handleCart, handleAddToCart, handleRemoveFromCart, handleClearCart, handleBuyAll } from "./handlers/cart.js";
import { handleWishlist, handleAddToWishlist, handleRemoveFromWishlist } from "./handlers/wishlist.js";
import { handleSearch, handleSearchQuery, searchAwaitingUsers } from "./handlers/search.js";
import { handleTrending } from "./handlers/trending.js";
import { handleLuxoraLearn, handleDigiNav, handleDigitalAccess } from "./handlers/digital.js";
import { handleRateProduct, handleSubmitReview } from "./handlers/reviews.js";
import {
  handleAddStart,
  handleAddDigitalStart,
  handleEditProduct,
  handleDeleteProduct,
  handlePromote,
  handleRemoveAdmin,
  handleAnnounce,
  handleLock,
  handleUnlock,
  handleAdminConversation,
  adminState,
} from "./handlers/admin.js";
import {
  handleAffiliateMenu,
  handleAffiliateCreateStart,
  handleAffiliateRegisterStart,
  handleAffiliatePayment,
  handleAffiliateDashboard,
  handleAffiliateConversation,
  affiliateState,
} from "./handlers/affiliate.js";
import { mainMenuKeyboard, categoriesKeyboard } from "./utils/keyboards.js";
import { CONTACT_ADMIN_USERNAME, LUXORA_BANNER, LUXORA_FOOTER } from "./constants.js";

export function createBot(): Telegraf {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set.");
  }

  const bot = new Telegraf(token);

  // ── COMMANDS ──

  bot.start((ctx) => handleStart(ctx));

  bot.command("add", (ctx) => handleAddStart(ctx));
  bot.command("adddigital", (ctx) => handleAddDigitalStart(ctx));
  bot.command("edit", (ctx) => handleEditProduct(ctx));
  bot.command("delete", (ctx) => handleDeleteProduct(ctx));
  bot.command("promote", (ctx) => handlePromote(ctx));
  bot.command("remove", (ctx) => handleRemoveAdmin(ctx));
  bot.command("announce", (ctx) => handleAnnounce(ctx, bot));
  bot.command("lock", (ctx) => handleLock(ctx));
  bot.command("unlock", (ctx) => handleUnlock(ctx));

  // /menu — show main menu
  bot.command("menu", async (ctx) => {
    const name = ctx.from?.first_name ?? "User";
    await ctx.reply(
      `${LUXORA_BANNER}\n\n_Welcome back, *${name}*\\._${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2", ...mainMenuKeyboard() }
    );
  });

  // ── TEXT MESSAGES (Main Menu Buttons) ──

  bot.on(message("text"), async (ctx) => {
    const userId = ctx.from?.id;
    const text = ctx.message.text.trim();

    try {
      // Check admin conversation first
      if (userId && adminState.has(userId)) {
        const handled = await handleAdminConversation(ctx);
        if (handled) return;
      }

      // Check affiliate conversation
      if (userId && affiliateState.has(userId)) {
        const handled = await handleAffiliateConversation(ctx, text);
        if (handled) return;
      }

      // Check if user is in search mode
      if (userId && searchAwaitingUsers.has(userId)) {
        await handleSearchQuery(ctx, text);
        return;
      }

      switch (text) {
        case "🛍 Shop Products":
          await handleShop(ctx);
          break;

        case "🔍 Search":
          await handleSearch(ctx);
          break;

        case "❤️ Wishlist":
          await handleWishlist(ctx);
          break;

        case "🛒 My Cart":
          await handleCart(ctx);
          break;

        case "📊 Trending":
          await handleTrending(ctx);
          break;

        case "🎓 Luxora Learn":
          await handleLuxoraLearn(ctx);
          break;

        case "🤝 Affiliate Program":
          await handleAffiliateMenu(ctx);
          break;

        case "📢 Contact Admin":
          await ctx.reply(
            `${LUXORA_BANNER}\n\n📢 *Contact Admin*\n\n_For any help, query or support, contact admin\\._\n\n👤 ${CONTACT_ADMIN_USERNAME}${LUXORA_FOOTER}`,
            { parse_mode: "MarkdownV2" }
          );
          break;

        default:
          // If not a menu button, show menu
          if (!text.startsWith("/")) {
            await ctx.reply(
              `${LUXORA_BANNER}\n\n_Use the menu below to navigate\\._${LUXORA_FOOTER}`,
              { parse_mode: "MarkdownV2", ...mainMenuKeyboard() }
            );
          }
      }
    } catch (err: unknown) {
      logger.error({ err }, "Error handling text message");
      try {
        await ctx.reply(
          `${LUXORA_BANNER}\n\n⚠️ _Something went wrong\\. Please try again\\._${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...mainMenuKeyboard() }
        );
      } catch {
        // ignore
      }
    }
  });

  // ── PHOTO MESSAGES (for admin product add flow) ──
  bot.on(message("photo"), async (ctx) => {
    const userId = ctx.from?.id;
    if (userId && adminState.has(userId)) {
      await handleAdminConversation(ctx as unknown as Context);
    }
  });

  // ── VIDEO MESSAGES (for admin product add flow) ──
  bot.on(message("video"), async (ctx) => {
    const userId = ctx.from?.id;
    if (userId && adminState.has(userId)) {
      await handleAdminConversation(ctx as unknown as Context);
    }
  });

  // ── INLINE QUERIES (for product sharing) ──
  bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query;
    if (query.startsWith("product_")) {
      const productId = query.replace("product_", "");
      const { getProduct } = await import("./db/products.js");
      const product = await getProduct(productId);

      if (product) {
        const botInfo = await bot.telegram.getMe();
        const shareText =
          `🛍 *LUXORA - ONLINE SHOPPING PLATFORM* 🛍\n\n` +
          `✨ *${product.title}*\n` +
          `💰 Price: ₹${product.price}\n\n` +
          `${product.description}\n\n` +
          `👉 View on LUXORA`;

        await ctx.answerInlineQuery([
          {
            type: "article",
            id: productId,
            title: product.title,
            description: `₹${product.price} — Tap to share`,
            input_message_content: {
              message_text: shareText,
              parse_mode: "Markdown",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "🛒 View on LUXORA",
                    url: `https://t.me/${botInfo.username}?start=product_${productId}`,
                  },
                ],
              ],
            },
          },
        ]);
      } else {
        await ctx.answerInlineQuery([]);
      }
    } else {
      await ctx.answerInlineQuery([]);
    }
  });

  // ── CALLBACK QUERIES ──

  bot.on("callback_query", async (ctx) => {
    const data = (ctx.callbackQuery as { data?: string }).data;
    if (!data) {
      await ctx.answerCbQuery();
      return;
    }

    try {
      // No-op button
      if (data === "noop") {
        await ctx.answerCbQuery();
        return;
      }

      // Main menu button
      if (data === "main_menu") {
        await ctx.answerCbQuery();
        const name = ctx.from?.first_name ?? "User";
        await ctx.reply(
          `${LUXORA_BANNER}\n\n_Welcome back, *${name}*\\._${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...mainMenuKeyboard() }
        );
        return;
      }

      // Affiliate callbacks
      if (data === "aff:menu") {
        await ctx.answerCbQuery();
        await handleAffiliateMenu(ctx);
        return;
      }
      if (data === "aff:create") {
        await ctx.answerCbQuery();
        await handleAffiliateCreateStart(ctx);
        return;
      }
      if (data === "aff:register") {
        await ctx.answerCbQuery();
        await handleAffiliateRegisterStart(ctx);
        return;
      }
      if (data === "aff:payment") {
        await ctx.answerCbQuery();
        await handleAffiliatePayment(ctx);
        return;
      }
      if (data === "aff:dashboard") {
        await ctx.answerCbQuery();
        await handleAffiliateDashboard(ctx);
        return;
      }

      // Show categories
      if (data === "show_categories") {
        await ctx.answerCbQuery();
        await ctx.reply(
          `${LUXORA_BANNER}\n\n🛍 *Choose a Category*${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...categoriesKeyboard() }
        );
        return;
      }

      // Category navigation: cat:<id>
      if (data.startsWith("cat:")) {
        await ctx.answerCbQuery();
        const category = data.split(":")[1]!;
        await handleCategory(ctx, category, 0);
        return;
      }

      // Product carousel navigation: nav:<newIndex>:<productId>
      if (data.startsWith("nav:")) {
        const parts = data.split(":");
        const newIndex = Number(parts[1]);
        const productId = parts[2]!;
        await handleProductNav(ctx, newIndex, productId);
        return;
      }

      // Cart actions: cart:add:<id>, cart:remove:<id>, cart:clear, cart:buyall
      if (data.startsWith("cart:")) {
        const parts = data.split(":");
        const action = parts[1];
        const productId = parts[2];

        if (action === "add" && productId) {
          await handleAddToCart(ctx, productId);
        } else if (action === "remove" && productId) {
          await handleRemoveFromCart(ctx, productId);
        } else if (action === "clear") {
          await handleClearCart(ctx);
        } else if (action === "buyall") {
          await handleBuyAll(ctx);
        }
        return;
      }

      // Wishlist actions: wish:add:<id>, wish:remove:<id>
      if (data.startsWith("wish:")) {
        const parts = data.split(":");
        const action = parts[1];
        const productId = parts[2];

        if (action === "add" && productId) {
          await handleAddToWishlist(ctx, productId);
        } else if (action === "remove" && productId) {
          await handleRemoveFromWishlist(ctx, productId);
        }
        return;
      }

      // Rating prompt: rate:<productId>
      if (data.startsWith("rate:")) {
        const productId = data.split(":")[1]!;
        await handleRateProduct(ctx, productId);
        return;
      }

      // Review submission: review:<productId>:<rating>
      if (data.startsWith("review:")) {
        const parts = data.split(":");
        const productId = parts[1]!;
        const rating = Number(parts[2]);
        await handleSubmitReview(ctx, productId, rating);
        return;
      }

      // Digital product navigation: digi:nav:<index>
      if (data.startsWith("digi:nav:")) {
        const index = Number(data.split(":")[2]);
        await handleDigiNav(ctx, index);
        return;
      }

      // Digital product access: digital:access:<id>
      if (data.startsWith("digital:access:")) {
        const productId = data.split(":")[2]!;
        await handleDigitalAccess(ctx, productId);
        return;
      }

      // Force join check
      if (data === "check_join") {
        await ctx.answerCbQuery("✅ Thanks for joining!");
        await handleStart(ctx);
        return;
      }

      await ctx.answerCbQuery();
    } catch (e: unknown) {
      logger.error({ err: e }, "Callback query error");
      try {
        await ctx.answerCbQuery("An error occurred. Please try again.");
      } catch {
        // ignore
      }
    }
  });

  // ── ERROR HANDLING ──
  bot.catch((err: unknown, ctx: Context) => {
    logger.error({ err, update: ctx.update }, "Telegram bot error");
  });

  return bot;
}
