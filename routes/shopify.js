import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * Shopify webhook / endpoint
 * Se llama cuando el usuario completa signup / checkout
 */
router.post("/create-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email es requerido"
      });
    }

    // Llamada interna a tu propio backend (SUMA)
    const response = await axios.post(
      `${process.env.BACKEND_URL}/suma/create-session`,
      { email }
    );

    return res.status(200).json({
      success: true,
      verificationUrl: response.data.verificationUrl
    });

  } catch (error) {
    console.error("❌ Error creando verificación SUMA desde Shopify:", 
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: "No se pudo iniciar la verificación"
    });
  }
});

export default router;
