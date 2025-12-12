import express from "express";
import { handleSumaWebhook } from "../controllers/sumaController.js";

const router = express.Router();

// 💚 Ruta correcta
router.post("/webhook", handleSumaWebhook);

// 💚 Parche: variantes comunes de errores (%0A, %0a, espacio, etc)
router.post("/webhook%0A", handleSumaWebhook);
router.post("/webhook%0a", handleSumaWebhook);
router.post("/webhook%20", handleSumaWebhook);

// 💚 Parche universal: si SUMA manda cualquier cosa después de /webhook
router.post("/webhook*", handleSumaWebhook);

export default router;
