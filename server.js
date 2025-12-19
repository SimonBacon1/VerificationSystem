import express from 'express';
import { sendTestEmail } from './services/email.js';
import { sendVerificationEmail } from './services/email.js';

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

app.get('/test/verification-email', async (req, res) => {
  console.log('TEST EMAIL endpoint hit');

  try {
    const result = await sendVerificationEmail({
      to: process.env.NOTIFY_EMAIL,
      verificationUrl: `${process.env.APP_BASE_URL}/verify/test-token`
    });

    console.log('Resend result:', result);

    res.json({ ok: true });
  } catch (err) {
    console.error('EMAIL ERROR:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


// // ✅ TEST VERIFICATION EMAIL ROUTE
// app.get('/test/verification-email', async (req, res) => {
//   try {
//     const testEmail = process.env.NOTIFY_EMAIL;

//     const verificationUrl = `${process.env.VERIFICATION_HOST}/verify?token=TEST_TOKEN_123`;

//     await sendVerificationEmail({
//       to: testEmail,
//       verificationUrl,
//     });

//     res.json({
//       ok: true,
//       message: 'Verification email sent',
//       to: testEmail,
//     });
//   } catch (error) {
//     console.error('Verification email error:', error);
//     res.status(500).json({
//       ok: false,
//       error: 'Failed to send verification email',
//     });
//   }
// });

// HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Verification system running');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
