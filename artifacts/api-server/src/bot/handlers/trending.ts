import { type Context } from "telegraf";
import { getTrendingProducts, incrementClick } from "../db/products.js";
import { formatProductCard } from "../utils/format.js";
import { productKeyboard } from "../utils/keyboards.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";

// Show trending products sorted by click count
export async function handleTrending(ctx: Context): Promise<void> {
  const products = await getTrendingProducts(10);

  if (products.length === 0) {
    await ctx.reply(
      `${LUXORA_BANNER}\n\n📊 *No trending products yet\\.*\n\n_Start browsing to generate trends\\._${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
    return;
  }

  const botInfo = ctx.botInfo;
  const botUsername = botInfo?.username ?? "luxora_bot";

  await ctx.reply(
    `${LUXORA_BANNER}\n\n📊 *Trending Now*\n\n_Most viewed products on LUXORA\\._${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );

  for (let i = 0; i < Math.min(products.length, 5); i++) {
    const product = products[i]!;
    await incrementClick(product.productId);

    const caption = formatProductCard(product);
    const keyboard = productKeyboard(
      product.productId,
      product.affiliateLink,
      i,
      Math.min(products.length, 5),
      botUsername
    );

    try {
      if (product.images && product.images.length > 0) {
        await ctx.replyWithPhoto(product.images[0]!, {
          caption,
          parse_mode: "MarkdownV2",
          ...keyboard,
        });
      } else {
        await ctx.reply(caption, {
          parse_mode: "MarkdownV2",
          ...keyboard,
        });
      }
    } catch {
      await ctx.reply(caption, {
        parse_mode: "MarkdownV2",
        ...keyboard,
      });
    }
  }
}
