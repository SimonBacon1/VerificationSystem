import express from "express";
import cors from "cors";

import sumaRoutes from "./routes/suma.js";
import shopifyRoutes from "./routes/shopify.js";
import { sendEmail } from './services/email.js';

app.get('/test/email', async (req, res) => {
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: '✅ Test de correo – Connabis',
      html: '<p>Este es un correo de prueba enviado correctamente con Resend.</p>',
    });

    res.json({ ok: true, message: 'Email enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


const app = express();

app.use(cors());
app.use(express.json());

app.use("/suma", sumaRoutes);
app.use("/shopify", shopifyRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});