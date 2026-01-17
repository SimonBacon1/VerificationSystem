import express from 'express';
import cors from 'cors';
import { sendTestEmail, sendVerificationEmail } from './services/email.js';
import shopifyRouter from './routes/shopify.js';
import sumaRouter from './routes/suma.js';

const app = express();  // ← Must come BEFORE app.use()

app.use(express.json());
app.use(cors());
app.use('/shopify', shopifyRouter);
app.use('/suma', sumaRouter);

// Test routes
app.get('/test/email', async (req, res) => {
  try {
    await sendTestEmail();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/test/verification-email', async (req, res) => {
  try {
    const result = await sendVerificationEmail({
      to: process.env.NOTIFY_EMAIL,
      verificationUrl: `${process.env.VERIFICATION_HOST}/verify?token=test-token`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Verification system running');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});