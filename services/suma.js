import axios from "axios";

export const createSumaSession = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email required" });

    // 1. SUMA TOKEN
    const tokenResp = await axios.post(
      `${process.env.SUMA_BASE_URL}/oauth/token`,
      {
        client_id: process.env.SUMA_CLIENT_ID,
        client_secret: process.env.SUMA_CLIENT_SECRET,
        grant_type: "client_credentials"
      }
    );

    const token = tokenResp.data.access_token;

    // 2. CREAR SESIÓN
    const sessionResp = await axios.post(
      `${process.env.SUMA_BASE_URL}/verifications`,
      {
        callbackUrl: `${process.env.BACKEND_URL}/suma/webhook`,
        type: ["document", "face", "liveness"],
        metadata: { userEmail: email }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const verificationUrl = sessionResp.data.url;

    // 3. MANDAR EMAIL AL CLIENTE
    await sendEmail({
      to: email,
      subject: "Verificación de Identidad",
      html: `
        <p>Hola,</p>
        <p>Por favor completa tu verificación de identidad usando tu teléfono:</p>
        <p><a href="${verificationUrl}">Haz clic aquí para verificar</a></p>
        `
    });

    return res.json({ ok: true, verificationUrl });
  } catch (err) {
    console.error("SUMA CREATE ERROR", err.response?.data || err);
    return res.status(500).json({ error: "suma_error" });
  }
};
