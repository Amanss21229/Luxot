import { type Context } from "telegraf";
import { getCart, addToCart, removeFromCart, clearCart } from "../db/cart.js";
import { getProduct } from "../db/products.js";
import { formatProductCard, formatCartSummary } from "../utils/format.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";
import { Markup } from "telegraf";

// Show user's cart — each item as a full product card with image + Buy Now button
export async function handleCart(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  const items = await getCart(userId);

  if (items.length === 0) {
    await ctx.reply(formatCartSummary([]), { parse_mode: "MarkdownV2" });
    return;
  }

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  await ctx.reply(
    `${LUXORA_BANNER}\n\n🛒 *Your Cart* \\(${items.length} item${items.length > 1 ? "s" : ""}\\)\n\n💰 *Total: ₹${total}*${LUXORA_FOOTER}`,
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("🗑 Clear Cart", "cart:clear"),
          Markup.button.callback("⚡ Buy All", "cart:buyall"),
        ],
      ]),
    }
  );

  // Show each item as a full product card with image + Buy Now + Remove buttons
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
          Markup.button.callback("❤️ Wishlist", `wish:add:${product.productId}`),
        ],
        [
          Markup.button.url("🔗 Share", shareUrl),
          Markup.button.callback("🗑 Remove", `cart:remove:${product.productId}`),
        ],
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
      // Skip item if product load fails — show simple text fallback
      try {
        await ctx.reply(
          `🛒 *${item.title.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&")}*\n💰 ₹${item.price}`,
          {
            parse_mode: "MarkdownV2",
            ...Markup.inlineKeyboard([
              [
                Markup.button.url("⚡ Buy Now", item.affiliateLink),
                Markup.button.callback("🗑 Remove", `cart:remove:${item.productId}`),
              ],
            ]),
          }
        );
      } catch {
        // ignore
      }
    }
  }
}

// Add product to cart
export async function handleAddToCart(ctx: Context, productId: string): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  const product = await getProduct(productId);
  if (!product) {
    await ctx.answerCbQuery("Product not found.");
    return;
  }

  await addToCart(userId, {
    productId: product.productId,
    title: product.title,
    price: product.price,
    affiliateLink: product.affiliateLink,
  });

  await ctx.answerCbQuery("✅ Added to cart!");
}

// Remove product from cart
export async function handleRemoveFromCart(ctx: Context, productId: string): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  await removeFromCart(userId, productId);
  await ctx.answerCbQuery("🗑 Removed from cart.");

  const items = await getCart(userId);
  if (items.length === 0) {
    await ctx.reply(
      `${LUXORA_BANNER}\n\n🛒 _Your cart is empty\\._${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
  } else {
    await ctx.reply(
      `${LUXORA_BANNER}\n\n✅ *Item removed\\. ${items.length} item${items.length > 1 ? "s" : ""} remaining in cart\\.*${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
  }
}

// Clear entire cart
export async function handleClearCart(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  await clearCart(userId);
  await ctx.answerCbQuery("🗑 Cart cleared.");
  await ctx.reply(
    `${LUXORA_BANNER}\n\n🗑 *Your cart has been cleared\\.*${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );
}

// Buy all — show affiliate links for all cart items
export async function handleBuyAll(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  const items = await getCart(userId);
  if (items.length === 0) {
    await ctx.answerCbQuery("Your cart is empty!");
    return;
  }

  await ctx.answerCbQuery();

  const buttons = items.map((item) => [
    Markup.button.url(`⚡ Buy: ${item.title.slice(0, 25)}`, item.affiliateLink),
  ]);

  await ctx.reply(
    `${LUXORA_BANNER}\n\n⚡ *Buy All Items*\n\n_Tap each item to open its purchase link\\._${LUXORA_FOOTER}`,
    {
      parse_mode: "MarkdownV2",
      ...Markup.inlineKeyboard(buttons),
    }
  );
}
