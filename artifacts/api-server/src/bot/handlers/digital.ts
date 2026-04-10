import { type Context } from "telegraf";
import { getAllDigitalProducts } from "../db/digital.js";
import { formatDigitalProductCard } from "../utils/format.js";
import { digitalProductKeyboard } from "../utils/keyboards.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";

// State for digital product pagination
export const digiPageState: Map<number, number> = new Map();

// Show Luxora Learn digital products
export async function handleLuxoraLearn(ctx: Context): Promise<void> {
  const products = await getAllDigitalProducts();

  if (products.length === 0) {
    await ctx.reply(
      `${LUXORA_BANNER}\n\n🎓 *Luxora Learn*\n\n_No digital products available yet\\. Check back soon\\._${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
    return;
  }

  const userId = ctx.from?.id;
  if (!userId) return;

  digiPageState.set(userId, 0);

  await showDigitalProduct(ctx, products, 0);
}

// Show digital product at a given index
export async function showDigitalProduct(
  ctx: Context,
  products: Awaited<ReturnType<typeof getAllDigitalProducts>>,
  index: number
): Promise<void> {
  const product = products[index];
  if (!product) return;

  const text = formatDigitalProductCard(product);
  const keyboard = digitalProductKeyboard(
    product.productId,
    product.fileLink,
    index,
    products.length
  );

  await ctx.reply(text, {
    parse_mode: "MarkdownV2",
    ...keyboard,
  });
}

// Navigate digital products
export async function handleDigiNav(ctx: Context, index: number): Promise<void> {
  const products = await getAllDigitalProducts();
  if (index < 0 || index >= products.length) {
    await ctx.answerCbQuery("No more products.");
    return;
  }

  const userId = ctx.from?.id;
  if (userId) digiPageState.set(userId, index);

  await ctx.answerCbQuery();
  await showDigitalProduct(ctx, products, index);
}

// Handle "Get Access" for a product without a file link
export async function handleDigitalAccess(ctx: Context, productId: string): Promise<void> {
  await ctx.answerCbQuery();
  await ctx.reply(
    `${LUXORA_BANNER}\n\n📥 *Access Request Received*\n\n_Please contact admin to get access to this digital product\\._\n\n📢 Contact: @Aman\\_PersonalBot${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );
}
