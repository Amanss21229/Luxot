import { Markup } from "telegraf";
import type { InlineKeyboardMarkup } from "telegraf/types";

// Main menu keyboard
export function mainMenuKeyboard() {
  return Markup.keyboard([
    ["🛍 Shop Products", "🔍 Search"],
    ["❤️ Wishlist", "🛒 My Cart"],
    ["📊 Trending", "🎓 Luxora Learn"],
    ["📢 Contact Admin"],
  ])
    .resize()
    .persistent();
}

// Categories inline keyboard
export function categoriesKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📱 Electronics", "cat:electronics"),
      Markup.button.callback("👗 Fashion", "cat:fashion"),
    ],
    [
      Markup.button.callback("👟 Shoes", "cat:shoes"),
      Markup.button.callback("🔧 Gadgets", "cat:gadgets"),
    ],
    [
      Markup.button.callback("📝 Stationery", "cat:stationery"),
      Markup.button.callback("🏠 Home", "cat:home"),
    ],
    [
      Markup.button.callback("💎 Accessories", "cat:accessories"),
      Markup.button.callback("🎓 Digital Store", "cat:digital"),
    ],
    [Markup.button.callback("⬅️ Back to Menu", "main_menu")],
  ]);
}

// Product action keyboard — share uses URL-based Telegram share (no inline mode needed)
export function productKeyboard(
  productId: string,
  affiliateLink: string,
  currentIndex: number,
  total: number,
  botUsername: string
): { reply_markup: InlineKeyboardMarkup } {
  const navRow = [];
  if (currentIndex > 0) {
    navRow.push(
      Markup.button.callback("⬅️ Prev", `nav:${currentIndex - 1}:${productId}`)
    );
  }
  navRow.push(
    Markup.button.callback(
      `${currentIndex + 1}/${total}`,
      "noop"
    )
  );
  if (currentIndex < total - 1) {
    navRow.push(
      Markup.button.callback("Next ➡️", `nav:${currentIndex + 1}:${productId}`)
    );
  }

  // Share URL: opens native Telegram share dialog with deep link to the product
  const shareUrl = `https://t.me/share/url?url=https://t.me/${botUsername}?start=product_${productId}`;

  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🛒 Add to Cart", `cart:add:${productId}`),
      Markup.button.url("⚡ Buy Now", affiliateLink),
    ],
    [
      Markup.button.callback("❤️ Wishlist", `wish:add:${productId}`),
      Markup.button.url("🔗 Share", shareUrl),
    ],
    navRow,
    [Markup.button.callback("⭐ Rate Product", `rate:${productId}`)],
    [Markup.button.callback("⬅️ Categories", "show_categories")],
  ]);
}

// Cart keyboard
export function cartKeyboard(
  items: Array<{ productId: string; title: string; affiliateLink?: string }>
) {
  const rows = items.map((item) => [
    Markup.button.callback(
      `🗑 Remove: ${item.title.slice(0, 20)}`,
      `cart:remove:${item.productId}`
    ),
  ]);
  rows.push([
    Markup.button.callback("🗑 Clear Cart", "cart:clear"),
    Markup.button.callback("🛍 Buy All", "cart:buyall"),
  ]);
  rows.push([Markup.button.callback("⬅️ Back to Menu", "main_menu")]);
  return Markup.inlineKeyboard(rows);
}

// Wishlist keyboard
export function wishlistKeyboard(
  items: Array<{ productId: string; title: string }>
) {
  const rows = items.map((item) => [
    Markup.button.callback(
      `🗑 Remove: ${item.title.slice(0, 20)}`,
      `wish:remove:${item.productId}`
    ),
  ]);
  rows.push([Markup.button.callback("⬅️ Back to Menu", "main_menu")]);
  return Markup.inlineKeyboard(rows);
}

// Rating keyboard
export function ratingKeyboard(productId: string) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("⭐ 1", `review:${productId}:1`),
      Markup.button.callback("⭐⭐ 2", `review:${productId}:2`),
      Markup.button.callback("⭐⭐⭐ 3", `review:${productId}:3`),
    ],
    [
      Markup.button.callback("⭐⭐⭐⭐ 4", `review:${productId}:4`),
      Markup.button.callback("⭐⭐⭐⭐⭐ 5", `review:${productId}:5`),
    ],
    [Markup.button.callback("❌ Cancel", "main_menu")],
  ]);
}

// Digital product keyboard
export function digitalProductKeyboard(
  productId: string,
  fileLink?: string,
  currentIndex?: number,
  total?: number
) {
  const rows = [];
  if (fileLink) {
    rows.push([Markup.button.url("📥 Get Access", fileLink)]);
  } else {
    rows.push([
      Markup.button.callback("📥 Get Access", `digital:access:${productId}`),
    ]);
  }
  if (
    currentIndex !== undefined &&
    total !== undefined &&
    total > 1
  ) {
    const navRow = [];
    if (currentIndex > 0) {
      navRow.push(
        Markup.button.callback(
          "⬅️ Prev",
          `digi:nav:${currentIndex - 1}`
        )
      );
    }
    navRow.push(
      Markup.button.callback(`${currentIndex + 1}/${total}`, "noop")
    );
    if (currentIndex < total - 1) {
      navRow.push(
        Markup.button.callback(
          "Next ➡️",
          `digi:nav:${currentIndex + 1}`
        )
      );
    }
    rows.push(navRow);
  }
  rows.push([Markup.button.callback("⬅️ Back to Menu", "main_menu")]);
  return Markup.inlineKeyboard(rows);
}

// Force join keyboard
export function forceJoinKeyboard(
  channels: Array<{ id: string; invite?: string; title?: string }>
) {
  const rows: ReturnType<typeof Markup.button.url | typeof Markup.button.callback>[][] = channels.map((ch) => [
    Markup.button.url(
      `📢 Join: ${ch.title ?? ch.id}`,
      ch.invite ?? `https://t.me/${ch.id.replace("@", "")}`
    ),
  ]);
  rows.push([Markup.button.callback("✅ I've Joined", "check_join")]);
  return Markup.inlineKeyboard(rows);
}
