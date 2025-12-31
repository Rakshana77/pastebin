import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import Paste from "../models/paste.js";
import { getNow } from "../time.js";

const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  // Validate content
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  // Validate TTL
  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  // Validate max views
  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const now = getNow(req);

  const expiresAt =
    ttl_seconds !== undefined
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

  const paste = await Paste.create({
    content,
    expiresAt,
    maxViews: max_views !== undefined ? max_views : null,
    views: 0
  });

  res.status(201).json({
    id: paste._id.toString(),
    url: `${process.env.BASE_URL}/p/${paste._id}`
  });
});


router.get("/pastes/:id", async (req, res) => {
  const paste = await Paste.findById(req.params.id);

  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  const now = getNow(req);

  // TTL check
  if (paste.expiresAt && now >= paste.expiresAt) {
    return res.status(404).json({ error: "Expired" });
  }

  // Max views check
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  // Increment views AFTER checks
  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - paste.views, 0),
    expires_at: paste.expiresAt
  });
});


router.get("/p/:id", async (req, res) => {
  const paste = await Paste.findById(req.params.id);

  if (!paste) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, "../views/error.html"));
  }

  const now = getNow(req);

  // TTL check
  if (paste.expiresAt && now >= paste.expiresAt) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, "../views/error.html"));
  }

  // Max views check
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, "../views/error.html"));
  }

  // Safe HTML rendering
  res.setHeader("Content-Type", "text/html");
  res.send(`<pre>${escapeHtml(paste.content)}</pre>`);
});


function escapeHtml(str) {
  return str.replace(/[&<>"']/g, ch => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return map[ch];
  });
}

export default router;
