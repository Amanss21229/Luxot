import { type Context } from "telegraf";
import { Markup } from "telegraf";
import { registerUser } from "../db/users.js";
import { formatWelcome, formatProductCard } from "../utils/format.js";
import { mainMenuKeyboard } from "../utils/keyboards.js";
import { getForceJoinConfig } from "../db/forceJoin.js";
import { getProduct } from "../db/products.js";
import { forceJoinKeyboard } from "../utils/keyboards.js";
import { LUXORA_BANNER, LUXORA_FOOTER } from "../constants.js";
import { logger } from "../../lib/logger.js";

// Handle /start command — register user, handle deep links, check force join
export async function handleStart(ctx: Context): Promise<void> {
  const user = ctx.from;
  if (!user) return;

  // Register user (non-blocking — don't fail start if this errors)
  try {
    await registerUser({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
    });
  } catch (err) {
    logger.error({ err }, "Failed to register user");
  }

  // Check force join (non-blocking)
  try {
    const fjConfig = await getForceJoinConfig();
    if (fjConfig) {
      try {
        const member = await ctx.telegram.getChatMember(
          fjConfig.channelId,
          user.id
        );
        if (
          member.status === "left" ||
          member.status === "kicked" ||
          member.status === "restricted"
        ) {
          await ctx.reply(
            `${LUXORA_BANNER}\n\n⚠️ *Please join our channel to use LUXORA\\.*${LUXORA_FOOTER}`,
            {
              parse_mode: "MarkdownV2",
              ...forceJoinKeyboard([
                { id: fjConfig.channelId, title: "Official Channel" },
              ]),
            }
          );
          return;
        }
      } catch {
        // Can't check membership — let them through
      }
    }
  } catch (err) {
    logger.warn({ err }, "Force join check failed — skipping");
  }

  // Handle deep link — full product card with image and all action buttons
  const payload =
    "text" in (ctx.message ?? {})
      ? ((ctx.message as { text?: string }).text ?? "").split(" ")[1]
      : undefined;

  if (payload?.startsWith("product_")) {
    const productId = payload.replace("product_", "");
    try {
      const product = await getProduct(productId);
      if (product) {
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
            Markup.button.callback("❤️ Wishlist", `wish:add:${product.productId}`),
            Markup.button.url("🔗 Share", shareUrl),
          ],
          [Markup.button.callback("⭐ Rate Product", `rate:${product.productId}`)],
          [Markup.button.callback("🛍 Browse More", "show_categories")],
        ]);

        // Send image(s) + caption with action buttons
        if (product.images && product.images.length > 0) {
          try {
            await ctx.replyWithPhoto(product.images[0]!, {
              caption,
              parse_mode: "MarkdownV2",
              ...keyboard,
            });
          } catch {
            // Fallback to text if image fails
            await ctx.reply(caption, { parse_mode: "MarkdownV2", ...keyboard });
          }

          // Extra images (up to 4 more)
          if (product.images.length > 1) {
            try {
              await ctx.replyWithMediaGroup(
                product.images.slice(1, 5).map((img) => ({
                  type: "photo" as const,
                  media: img,
                }))
              );
            } catch {
              // ignore extra images
            }
          }

          // Video if available
          if (product.video) {
            try {
              await ctx.replyWithVideo(product.video, {
                caption: `🎬 *${product.title.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&")}*`,
                parse_mode: "MarkdownV2",
              });
            } catch {
              // ignore video
            }
          }
        } else {
          await ctx.reply(caption, { parse_mode: "MarkdownV2", ...keyboard });
        }

        // Show main menu below
        await ctx.reply(
          `${LUXORA_BANNER}\n\n_Use the menu below to continue shopping\\._${LUXORA_FOOTER}`,
          { parse_mode: "MarkdownV2", ...mainMenuKeyboard() }
        );
        return;
      }
    } catch (err) {
      logger.warn({ err }, "Failed to load shared product");
    }
  }

  // Default welcome — always show this even if DB is unreachable
  const name = user.first_name;
  await ctx.reply(formatWelcome(name), {
    parse_mode: "MarkdownV2",
    ...mainMenuKeyboard(),
  });
}
