import { LUXORA_BANNER, LUXORA_FOOTER, STATIC_RATING } from "../constants.js";

// Escape MarkdownV2 special characters
export function escMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
}

// Format a product card as a premium bordered message
export function formatProductCard(product: {
  productId: string;
  title: string;
  price: number | string;
  description: string;
  category: string;
  rating?: number;
  totalReviews?: number;
  clicks?: number;
}): string {
  const rating = product.rating
    ? `${"⭐".repeat(Math.round(product.rating))} (${product.totalReviews ?? 0} reviews)`
    : STATIC_RATING;

  return (
    `${LUXORA_BANNER}\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`\n\n` +
    `✨ *${escMd(product.title)}*\n\n` +
    `📂 Category: ${escMd(product.category)}\n` +
    `${rating}\n\n` +
    `💰 *Price: ₹${escMd(String(product.price))}*\n\n` +
    `📝 ${escMd(product.description)}\n\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`` +
    LUXORA_FOOTER
  );
}

// Format a digital product card
export function formatDigitalProductCard(product: {
  productId: string;
  title: string;
  price: number | string;
  description: string;
  fileLink?: string;
}): string {
  return (
    `${LUXORA_BANNER}\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`\n\n` +
    `🎓 *${escMd(product.title)}*\n\n` +
    `💰 *Price: ₹${escMd(String(product.price))}*\n\n` +
    `📝 ${escMd(product.description)}\n\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`` +
    LUXORA_FOOTER
  );
}

// Format the welcome/home message
export function formatWelcome(name: string): string {
  return (
    `${LUXORA_BANNER}\n\n` +
    `Welcome, *${escMd(name)}* ✨\n\n` +
    `_Your premium shopping destination awaits\\._\n\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`\n` +
    `Choose an option below to begin your journey\\.` +
    LUXORA_FOOTER
  );
}

// Format cart summary
export function formatCartSummary(
  items: Array<{ title: string; price: number | string; productId: string }>
): string {
  if (items.length === 0) {
    return (
      `${LUXORA_BANNER}\n\n` +
      `🛒 *Your cart is empty*\n\n` +
      `_Browse our collection and add items you love\\._` +
      LUXORA_FOOTER
    );
  }

  let total = 0;
  let list = items
    .map((item, i) => {
      const price = Number(item.price);
      total += isNaN(price) ? 0 : price;
      return `${i + 1}\\. *${escMd(item.title)}* — ₹${escMd(String(item.price))}`;
    })
    .join("\n");

  return (
    `${LUXORA_BANNER}\n\n` +
    `🛒 *Your Cart*\n\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`\n` +
    `${list}\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`\n\n` +
    `💰 *Total: ₹${escMd(String(total))}*` +
    LUXORA_FOOTER
  );
}

// Format wishlist
export function formatWishlist(
  items: Array<{ title: string; price: number | string; productId: string }>
): string {
  if (items.length === 0) {
    return (
      `${LUXORA_BANNER}\n\n` +
      `❤️ *Your wishlist is empty*\n\n` +
      `_Save items you love to your wishlist\\._` +
      LUXORA_FOOTER
    );
  }

  const list = items
    .map(
      (item, i) =>
        `${i + 1}\\. *${escMd(item.title)}* — ₹${escMd(String(item.price))}`
    )
    .join("\n");

  return (
    `${LUXORA_BANNER}\n\n` +
    `❤️ *Your Wishlist*\n\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`\n` +
    `${list}\n` +
    `\`━━━━━━━━━━━━━━━━━━━━━━\`` +
    LUXORA_FOOTER
  );
}
