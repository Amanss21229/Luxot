import { type Context } from "telegraf";
import { getProductsByCategory, getProduct, incrementClick } from "../db/products.js";
import { formatProductCard } from "../utils/format.js";
import { categoriesKeyboard, productKeyboard } from "../utils/keyboards.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";

// Show category selection
export async function handleShop(ctx: Context): Promise<void> {
  await ctx.reply(
    `${LUXORA_BANNER}\n\n🛍 *Choose a Category*\n\n_Browse our curated collection\\._${LUXORA_FOOTER}`,
    {
      parse_mode: "MarkdownV2",
      ...categoriesKeyboard(),
    }
  );
}

// Show products in a category, starting from index 0
export async function handleCategory(
  ctx: Context,
  category: string,
  index = 0
): Promise<void> {
  const products = await getProductsByCategory(category);

  if (products.length === 0) {
    await ctx.answerCbQuery("No products in this category yet.");
    await ctx.reply(
      `${LUXORA_BANNER}\n\n_No products in this category yet\\. Check back soon\\._${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2", ...categoriesKeyboard() }
    );
    return;
  }

  const product = products[index];
  if (!product) return;

  // Track click
  await incrementClick(product.productId);

  const botInfo = ctx.botInfo;
  const botUsername = botInfo?.username ?? "luxora_bot";

  const caption = formatProductCard(product);
  const keyboard = productKeyboard(
    product.productId,
    product.affiliateLink,
    index,
    products.length,
    botUsername
  );

  try {
    if (product.images && product.images.length > 0) {
      // Send first image with caption
      await ctx.replyWithPhoto(product.images[0]!, {
        caption,
        parse_mode: "MarkdownV2",
        ...keyboard,
      });

      // Send remaining images if any (up to 4 more)
      if (product.images.length > 1) {
        const media = product.images.slice(1, 5).map((img) => ({
          type: "photo" as const,
          media: img,
        }));
        await ctx.replyWithMediaGroup(media);
      }

      // Send video if available
      if (product.video) {
        await ctx.replyWithVideo(product.video, {
          caption: `🎬 *${product.title}*`,
          parse_mode: "MarkdownV2",
        });
      }
    } else {
      await ctx.reply(caption, {
        parse_mode: "MarkdownV2",
        ...keyboard,
      });
    }
  } catch {
    // Fallback to text if media fails
    await ctx.reply(caption, {
      parse_mode: "MarkdownV2",
      ...keyboard,
    });
  }
}

// Navigate carousel — handle prev/next
export async function handleProductNav(
  ctx: Context,
  newIndex: number,
  currentProductId: string
): Promise<void> {
  // Find the product's category to reload category list
  const product = await getProduct(currentProductId);
  if (!product) {
    await ctx.answerCbQuery("Product not found.");
    return;
  }

  const products = await getProductsByCategory(product.category);
  if (newIndex < 0 || newIndex >= products.length) {
    await ctx.answerCbQuery("No more products.");
    return;
  }

  await ctx.answerCbQuery();
  await handleCategory(ctx, product.category, newIndex);
}
