import express from 'express';
import { sendTestEmail } from './services/email.js';

const app = express();

app.use(express.json());

// ✅ TEST EMAIL ROUTE
app.get('/test/email', async (req, res) => {
  try {
    await sendTestEmail();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Verification system running');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
