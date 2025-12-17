import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * 🔹 Crear sesión de verificación SUMA
 * Shopify / Registro → llama este endpoint
 */
router.post("/create-session", express.json(), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    // 1️⃣ Obtener token OAuth de SUMA
    const tokenResponse = await axios.post(
      `${process.env.SUMA_BASE_URL}/oauth/token`,
      {
        client_id: process.env.SUMA_CLIENT_ID,
        client_secret: process.env.SUMA_CLIENT_SECRET,
        grant_type: "client_credentials"
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2️⃣ Crear sesión de verificación
    const verificationResponse = await axios.post(
      `${process.env.SUMA_BASE_URL}/verifications`,
      {
        callbackUrl: `${process.env.BACKEND_URL}/suma/webhook`,
        type: ["document", "face", "liveness"],
        metadata: {
          userEmail: email
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const verificationUrl = verificationResponse.data.url;

    // 3️⃣ Responder (el email lo envía Shopify o frontend si quieres)
    return res.json({
      success: true,
      verificationUrl
    });
  } catch (error) {
    console.error("❌ Error creando sesión SUMA:", error.response?.data || error);
    return res.status(500).json({ error: "Error creando sesión de verificación" });
  }
});

/**
 * 🔹 Webhook de SUMA
 * SUMA → resultados de verificación
 */
router.post(
  "/webhook",
  express.json({ limit: "5mb" }),
  async (req, res) => {
    try {
      console.log("📩 Webhook SUMA recibido:");
      console.log(JSON.stringify(req.body, null, 2));

      const status = req.body?.status;
      const email = req.body?.metadata?.userEmail;

      // 🔔 Aquí luego puedes:
      // - Enviar email al cliente
      // - Notificar a connabisco@gmail.com
      // - Etiquetar usuario en Shopify

      return res
        .status(200)
        .set("Content-Type", "application/json")
        .send('{"success": true}\n');
    } catch (err) {
      console.error("❌ Error procesando webhook SUMA:", err);
      return res.status(500).json({ success: false });
    }
  }
);

/**
 * 🔹 Health check rápido
 */
router.get("/", (req, res) => {
  res.send("SUMA routes OK");
});

export default router;
