import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/healthz", (req, res) => {
  res.json({ ok: mongoose.connection.readyState === 1 });
});

export default router;
