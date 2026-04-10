import { Router } from "express";

const router = Router();

const TELEGRAM_TOKEN = process.env["TELEGRAM_BOT_TOKEN"];

router.get("/images/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!TELEGRAM_TOKEN) {
      res.status(503).json({ error: "Image service unavailable" });
      return;
    }

    const infoRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`
    );
    const info = (await infoRes.json()) as { ok: boolean; result?: { file_path: string } };

    if (!info.ok || !info.result?.file_path) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${info.result.file_path}`;
    const fileRes = await fetch(fileUrl);

    if (!fileRes.ok) {
      res.status(502).json({ error: "Failed to fetch image" });
      return;
    }

    const contentType = fileRes.headers.get("content-type") ?? "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const buffer = await fileRes.arrayBuffer();
    res.end(Buffer.from(buffer));
  } catch {
    res.status(500).json({ error: "Image proxy error" });
  }
});

export default router;
