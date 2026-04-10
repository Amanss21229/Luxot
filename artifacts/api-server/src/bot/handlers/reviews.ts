import { type Context } from "telegraf";
import { submitReview } from "../db/reviews.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";
import { ratingKeyboard } from "../utils/keyboards.js";

// Prompt user to rate a product
export async function handleRateProduct(ctx: Context, productId: string): Promise<void> {
  await ctx.answerCbQuery();
  await ctx.reply(
    `${LUXORA_BANNER}\n\n⭐ *Rate this product*\n\n_Select your rating below\\._${LUXORA_FOOTER}`,
    {
      parse_mode: "MarkdownV2",
      ...ratingKeyboard(productId),
    }
  );
}

// Submit a review rating
export async function handleSubmitReview(
  ctx: Context,
  productId: string,
  rating: number
): Promise<void> {
  const userId = ctx.from?.id;
  if (!userId) return;

  await submitReview(userId, productId, rating);
  await ctx.answerCbQuery(`⭐ You rated this ${rating}/5. Thank you!`);
  await ctx.reply(
    `${LUXORA_BANNER}\n\n✅ *Review submitted\\!*\n\n_You rated this product: ${"⭐".repeat(rating)} \\(${rating}/5\\)_${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );
}
