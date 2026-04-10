import app from "./app.js";
import { logger } from "./lib/logger.js";
import { createBot } from "./bot/index.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Start Express server (for health checks / API)
app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});

// Start Telegram bot with long polling
const bot = createBot();

bot.launch({
  dropPendingUpdates: true,
}).then(() => {
  logger.info("LUXORA Telegram bot is running via long polling");
}).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("409") || message.includes("Conflict")) {
    logger.warn({ err }, "Telegram bot 409 conflict — another instance is already running. HTTP server continues.");
  } else {
    logger.error({ err }, "Failed to launch Telegram bot");
    process.exit(1);
  }
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
