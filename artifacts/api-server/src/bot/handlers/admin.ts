import { type Context, type Telegraf } from "telegraf";
import { isAdmin, promoteAdmin, removeAdmin } from "../db/admins.js";
import { getAllUserIds } from "../db/users.js";
import { addProduct, getProduct, deleteProduct, updateProduct } from "../db/products.js";
import { addDigitalProduct } from "../db/digital.js";
import { setForceJoin, removeForceJoin } from "../db/forceJoin.js";
import { LUXORA_BANNER, LUXORA_FOOTER, CATEGORIES } from "../constants.js";
import { logger } from "../../lib/logger.js";

// Track multi-step admin conversations
export const adminState: Map<number, Record<string, unknown>> = new Map();

// Check admin and reply if not authorized
async function requireAdmin(ctx: Context): Promise<boolean> {
  const userId = ctx.from?.id;
  if (!userId) return false;
  if (await isAdmin(userId)) return true;
  await ctx.reply("⛔ *Unauthorized\\. Admin only\\.*", { parse_mode: "MarkdownV2" });
  return false;
}

// /promote <user_id> — add admin
export async function handlePromote(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const msg = (ctx.message as { text?: string })?.text ?? "";
  const parts = msg.split(" ");
  const targetId = Number(parts[1]);
  if (!targetId || isNaN(targetId)) {
    await ctx.reply("Usage: /promote \\<user\\_id\\>", { parse_mode: "MarkdownV2" });
    return;
  }
  try {
    await promoteAdmin(targetId);
    await ctx.reply(
      `${LUXORA_BANNER}\n\n✅ *User ${targetId} has been promoted to admin\\.*${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (e: unknown) {
    await ctx.reply(`❌ Error: ${String(e instanceof Error ? e.message : e)}`);
  }
}

// /remove <user_id> — remove admin
export async function handleRemoveAdmin(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const msg = (ctx.message as { text?: string })?.text ?? "";
  const parts = msg.split(" ");
  const targetId = Number(parts[1]);
  if (!targetId || isNaN(targetId)) {
    await ctx.reply("Usage: /remove \\<user\\_id\\>", { parse_mode: "MarkdownV2" });
    return;
  }
  try {
    await removeAdmin(targetId);
    await ctx.reply(
      `${LUXORA_BANNER}\n\n✅ *Admin ${targetId} has been removed\\.*${LUXORA_FOOTER}`,
      { parse_mode: "MarkdownV2" }
    );
  } catch (e: unknown) {
    await ctx.reply(`❌ ${String(e instanceof Error ? e.message : e)}`);
  }
}

// /delete <product_id> — delete product
export async function handleDeleteProduct(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const msg = (ctx.message as { text?: string })?.text ?? "";
  const parts = msg.split(" ");
  const productId = parts[1];
  if (!productId) {
    await ctx.reply("Usage: /delete \\<product\\_id\\>", { parse_mode: "MarkdownV2" });
    return;
  }
  try {
    await deleteProduct(productId);
    await ctx.reply(`✅ Product \`${productId}\` deleted\\.`, { parse_mode: "MarkdownV2" });
  } catch (e: unknown) {
    await ctx.reply(`❌ ${String(e instanceof Error ? e.message : e)}`);
  }
}

// /add — start step-by-step product add flow
export async function handleAddStart(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const userId = ctx.from!.id;
  adminState.set(userId, { step: "add_title", type: "product" });
  await ctx.reply(
    `${LUXORA_BANNER}\n\n➕ *Add New Product*\n\nStep 1/7: Send the *product title*\\.${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );
}

// /adddigital — start digital product add flow
export async function handleAddDigitalStart(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const userId = ctx.from!.id;
  adminState.set(userId, { step: "digi_title", type: "digital" });
  await ctx.reply(
    `${LUXORA_BANNER}\n\n➕ *Add Digital Product*\n\nStep 1/4: Send the *product title*\\.${LUXORA_FOOTER}`,
    { parse_mode: "MarkdownV2" }
  );
}

// /edit <product_id> <field> <value> — edit a product field
export async function handleEditProduct(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const msg = (ctx.message as { text?: string })?.text ?? "";
  const parts = msg.split(" ");
  const productId = parts[1];
  const field = parts[2];
  const value = parts.slice(3).join(" ");
  if (!productId || !field || !value) {
    await ctx.reply(
      "Usage: /edit \\<product\\_id\\> \\<field\\> \\<value\\>\n\nFields: title, price, description, affiliateLink",
      { parse_mode: "MarkdownV2" }
    );
    return;
  }
  const allowedFields = ["title", "price", "description", "affiliateLink"];
  if (!allowedFields.includes(field)) {
    await ctx.reply(`❌ Field must be one of: ${allowedFields.join(", ")}`);
    return;
  }
  try {
    const update: Record<string, unknown> = {};
    update[field] = field === "price" ? Number(value) : value;
    await updateProduct(productId, update);
    await ctx.reply(`✅ Product updated: *${field}* → \`${value}\``, { parse_mode: "MarkdownV2" });
  } catch (e: unknown) {
    await ctx.reply(`❌ ${String(e instanceof Error ? e.message : e)}`);
  }
}

// /lock <bot_id> <group_id> <channel_id>
export async function handleLock(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  const msg = (ctx.message as { text?: string })?.text ?? "";
  const parts = msg.split(" ");
  const [, botId, groupId, channelId] = parts;
  if (!botId || !groupId || !channelId) {
    await ctx.reply(
      "Usage: /lock \\<bot\\_id\\> \\<group\\_id\\> \\<channel\\_id\\>",
      { parse_mode: "MarkdownV2" }
    );
    return;
  }
  await setForceJoin(botId, groupId, channelId);
  await ctx.reply(`✅ *Force join enabled\\.*\nChannel: \`${channelId}\``, { parse_mode: "MarkdownV2" });
}

// /unlock <bot_id> <group_id> <channel_id>
export async function handleUnlock(ctx: Context): Promise<void> {
  if (!(await requireAdmin(ctx))) return;
  await removeForceJoin();
  await ctx.reply("✅ *Force join disabled\\.*", { parse_mode: "MarkdownV2" });
}

// /announce — broadcast the replied message to all users
export async function handleAnnounce(ctx: Context, bot: Telegraf): Promise<void> {
  if (!(await requireAdmin(ctx))) return;

  const replyMsg = (ctx.message as { reply_to_message?: unknown })?.reply_to_message;
  if (!replyMsg) {
    await ctx.reply(
      "Reply to a message with /announce to broadcast it to all users\\.",
      { parse_mode: "MarkdownV2" }
    );
    return;
  }

  const userIds = await getAllUserIds();
  await ctx.reply(
    `📢 *Broadcasting to ${userIds.length} users\\.\\.\\.*`,
    { parse_mode: "MarkdownV2" }
  );

  let success = 0;
  let failed = 0;

  for (const uid of userIds) {
    try {
      await bot.telegram.forwardMessage(uid, ctx.chat!.id, (replyMsg as { message_id: number }).message_id);
      success++;
    } catch {
      failed++;
    }
    // Throttle to avoid hitting Telegram rate limits
    await new Promise((r) => setTimeout(r, 35));
  }

  await ctx.reply(
    `✅ *Broadcast complete\\!*\n\n• Delivered: ${success}\n• Failed: ${failed}`,
    { parse_mode: "MarkdownV2" }
  );
}

// Handle step-by-step admin conversation messages
export async function handleAdminConversation(ctx: Context): Promise<boolean> {
  const userId = ctx.from?.id;
  if (!userId) return false;

  const state = adminState.get(userId);
  if (!state) return false;

  const msg = ctx.message as {
    text?: string;
    photo?: Array<{ file_id: string }>;
    video?: { file_id: string };
  };

  const text = msg?.text ?? "";

  // ── PRODUCT ADD FLOW ──
  if (state["type"] === "product") {
    switch (state["step"]) {
      case "add_title":
        adminState.set(userId, { ...state, title: text, step: "add_price" });
        await ctx.reply("Step 2/7: Send the *price* \\(numbers only, e\\.g\\. 999\\)\\.", { parse_mode: "MarkdownV2" });
        return true;

      case "add_price":
        if (isNaN(Number(text))) {
          await ctx.reply("❌ Price must be a number\\. Try again\\.", { parse_mode: "MarkdownV2" });
          return true;
        }
        adminState.set(userId, { ...state, price: Number(text), step: "add_desc" });
        await ctx.reply("Step 3/7: Send the *description*\\.", { parse_mode: "MarkdownV2" });
        return true;

      case "add_desc":
        adminState.set(userId, { ...state, description: text, step: "add_category" });
        const catList = CATEGORIES.map((c, i) => `${i + 1}\\. ${c.name} \\(${c.id}\\)`).join("\n");
        await ctx.reply(
          `Step 4/7: Send the *category ID* from:\n\n${catList}`,
          { parse_mode: "MarkdownV2" }
        );
        return true;

      case "add_category":
        if (!CATEGORIES.find((c) => c.id === text.trim())) {
          await ctx.reply("❌ Invalid category\\. Send a valid ID like: electronics, fashion, shoes\\.", { parse_mode: "MarkdownV2" });
          return true;
        }
        adminState.set(userId, { ...state, category: text.trim(), step: "add_link" });
        await ctx.reply("Step 5/7: Send the *affiliate link* \\(full URL\\)\\.", { parse_mode: "MarkdownV2" });
        return true;

      case "add_link":
        adminState.set(userId, { ...state, affiliateLink: text.trim(), step: "add_images", images: [] });
        await ctx.reply(
          "Step 6/7: Send up to *5 images* one by one\\. Type `done` when finished \\(or send first image now\\)\\.",
          { parse_mode: "MarkdownV2" }
        );
        return true;

      case "add_images":
        if (text.toLowerCase() === "done") {
          adminState.set(userId, { ...state, step: "add_video" });
          await ctx.reply(
            "Step 7/7: Send a *video* file\\_id/URL \\(optional\\)\\. Type `skip` to skip\\.",
            { parse_mode: "MarkdownV2" }
          );
          return true;
        }
        if (msg?.photo) {
          const fileId = msg.photo[msg.photo.length - 1]!.file_id;
          const images = (state["images"] as string[]) ?? [];
          if (images.length < 5) {
            images.push(fileId);
            adminState.set(userId, { ...state, images });
            await ctx.reply(
              `✅ Image ${images.length}/5 saved\\. Send more or type \`done\`\\.`,
              { parse_mode: "MarkdownV2" }
            );
          } else {
            await ctx.reply("⚠️ Maximum 5 images reached\\. Type \`done\` to continue\\.", { parse_mode: "MarkdownV2" });
          }
          return true;
        }
        await ctx.reply("Send an image photo or type \`done\`\\.", { parse_mode: "MarkdownV2" });
        return true;

      case "add_video": {
        const video = text.toLowerCase() === "skip" ? undefined : (msg?.video?.file_id ?? text);
        const productData = {
          title: state["title"] as string,
          price: state["price"] as number,
          description: state["description"] as string,
          category: state["category"] as string,
          affiliateLink: state["affiliateLink"] as string,
          images: (state["images"] as string[]) ?? [],
          ...(video ? { video } : {}),
        };
        try {
          const productId = await addProduct(productData);
          adminState.delete(userId);
          await ctx.reply(
            `${LUXORA_BANNER}\n\n✅ *Product added successfully\\!*\n\nID: \`${productId}\`${LUXORA_FOOTER}`,
            { parse_mode: "MarkdownV2" }
          );
        } catch (e: unknown) {
          await ctx.reply(`❌ Failed: ${String(e instanceof Error ? e.message : e)}`);
        }
        return true;
      }
    }
  }

  // ── DIGITAL PRODUCT ADD FLOW ──
  if (state["type"] === "digital") {
    switch (state["step"]) {
      case "digi_title":
        adminState.set(userId, { ...state, title: text, step: "digi_price" });
        await ctx.reply("Step 2/4: Send the *price* \\(numbers only\\)\\.", { parse_mode: "MarkdownV2" });
        return true;

      case "digi_price":
        if (isNaN(Number(text))) {
          await ctx.reply("❌ Price must be a number\\.", { parse_mode: "MarkdownV2" });
          return true;
        }
        adminState.set(userId, { ...state, price: Number(text), step: "digi_desc" });
        await ctx.reply("Step 3/4: Send the *description*\\.", { parse_mode: "MarkdownV2" });
        return true;

      case "digi_desc":
        adminState.set(userId, { ...state, description: text, step: "digi_link" });
        await ctx.reply(
          "Step 4/4: Send the *file link* \\(PDF URL, Google Drive, etc\\.\\)\\. Type `skip` if none yet\\.",
          { parse_mode: "MarkdownV2" }
        );
        return true;

      case "digi_link": {
        const fileLink = text.toLowerCase() === "skip" ? undefined : text.trim();
        try {
          const productId = await addDigitalProduct({
            title: state["title"] as string,
            price: state["price"] as number,
            description: state["description"] as string,
            ...(fileLink ? { fileLink } : {}),
          });
          adminState.delete(userId);
          await ctx.reply(
            `${LUXORA_BANNER}\n\n✅ *Digital product added\\!*\n\nID: \`${productId}\`${LUXORA_FOOTER}`,
            { parse_mode: "MarkdownV2" }
          );
        } catch (e: unknown) {
          await ctx.reply(`❌ Failed: ${String(e instanceof Error ? e.message : e)}`);
        }
        return true;
      }
    }
  }

  return false;
}
