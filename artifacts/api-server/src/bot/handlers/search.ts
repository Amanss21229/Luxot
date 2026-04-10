import { type Context } from "telegraf";
import { searchProducts, incrementClick } from "../db/products.js";
import { formatProductCard } from "../utils/format.js";
import { productKeyboard } from "../utils/keyboards.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";

// In-memory state to track users awaiting search input
export const searchAwaitingUsers = new Set<number>();

// Prompt user to enter search keyword
export async function handleSearch(ctx: Context): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  searchAwaitingUsers.add(userId);

  await ctx.reply(
    `${LUXORA_BANNER}\n\n🔍 *Search Products*\n\n_Type a keyword to search\\. Example: Nike, iPhone, Pen\\._${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );
}

// Process search query
export async function handleSearchQuery(ctx: Context, query: string): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  searchAwaitingUsers.delete(userId);

  const products = await searchProducts(query);

  if (products.length === 0) {
    await ctx.reply(
      `${LUXORA_BANNER}\n\n🔍 *No results for:* "${query}"\n\n_Try a different keyword\\._${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
    return;
  }

  const botInfo = ctx.botInfo;
  const botUsername = botInfo?.username ?? "luxora_bot";

  await ctx.reply(
    `${LUXORA_BANNER}\n\n🔍 *Found ${products.length} result\\(s\\) for:* "${query}"${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );

  // Show up to 5 results
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
