import express from "express";
import { createSumaSession, handleSumaWebhook } from "../suma.js";

const router = express.Router();

router.post("/create-session", createSumaSession);
router.post("/webhook", handleSumaWebhook);

export default router;
