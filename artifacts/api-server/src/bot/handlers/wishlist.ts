import { type Context } from "telegraf";
import { getWishlist, addToWishlist, removeFromWishlist } from "../db/wishlist.js";
import { getProduct } from "../db/products.js";
import { formatProductCard, formatWishlist } from "../utils/format.js";
import { Markup } from "telegraf";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";

// Show user's wishlist — each item as a full product card with image and Buy Now button
export async function handleWishlist(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  const items = await getWishlist(userId);

  if (items.length === 0) {
    await ctx.reply(formatWishlist([]), { parse_mode: "MarkdownV2" });
    return;
  }

  await ctx.reply(
    `${LUXORA_BANNER}\n\n❤️ *Your Wishlist* \\(${items.length} item${items.length > 1 ? "s" : ""}\\)${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );

  // Show each item as a full product card with image + action buttons
  for (const item of items) {
    try {
      const product = await getProduct(item.productId);
      if (!product) continue;

      const botInfo = ctx.botInfo;
      const botUsername = botInfo?.username ?? "LuxoraShoppingBot";
      const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}?start=product_${product.productId}`;

      const caption = formatProductCard(product);
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.url("⚡ Buy Now", product.affiliateLink),
          Markup.button.callback("🛒 Add to Cart", `cart:add:${product.productId}`),
        ],
        [
          Markup.button.url("🔗 Share", shareUrl),
          Markup.button.callback("🗑 Remove", `wish:remove:${product.productId}`),
        ],
        [Markup.button.callback("⭐ Rate", `rate:${product.productId}`)],
      ]);

      if (product.images && product.images.length > 0) {
        try {
          await ctx.replyWithPhoto(product.images[0]!, {
            caption,
            parse_mode: "MarkdownV2",
            ...keyboard,
          });
        } catch {
          await ctx.reply(caption, { parse_mode: "MarkdownV2", ...keyboard });
        }
      } else {
        await ctx.reply(caption, { parse_mode: "MarkdownV2", ...keyboard });
      }
    } catch {
      // Skip item if product can't be loaded
    }
  }
}

// Add product to wishlist (now stores affiliateLink too)
export async function handleAddToWishlist(ctx: Context, productId: string): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  const product = await getProduct(productId);
  if (!product) {
    await ctx.answerCbQuery("Product not found.");
    return;
  }

  await addToWishlist(userId, {
    productId: product.productId,
    title: product.title,
    price: product.price,
    affiliateLink: product.affiliateLink,
  });

  await ctx.answerCbQuery("❤️ Added to wishlist!");
}

// Remove product from wishlist
export async function handleRemoveFromWishlist(ctx: Context, productId: string): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  await removeFromWishlist(userId, productId);
  await ctx.answerCbQuery("🗑 Removed from wishlist.");

  // Refresh wishlist view
  const items = await getWishlist(userId);
  if (items.length === 0) {
    await ctx.reply(formatWishlist([]), { parse_mode: "MarkdownV2" });
  } else {
    await ctx.reply(
      `${LUXORA_BANNER}\n\n❤️ *Item removed\\. ${items.length} item${items.length > 1 ? "s" : ""} remaining\\.*${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
  }
}
