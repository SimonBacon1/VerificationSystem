import express from "express";
const router = express.Router();

router.post("/webhook", (req, res) => {
  console.log("SUMA webhook received:", req.body);
  res.status(200).json({ ok: true });
});

export default router;