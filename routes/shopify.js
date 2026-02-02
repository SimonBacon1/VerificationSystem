import express from 'express';
import { verifyShopifyHmac } from '../utils/verifyShopify.js';
import { createSumaVerification } from '../services/suma.js';
import { sendVerificationEmail } from '../services/email.js';

const router = express.Router();

// Existing order webhook (keep for future use)
router.post('/order-created', (req, res) => {
  if (!verifyShopifyHmac(req)) {
    return res.status(401).send('Invalid HMAC');
  }

  const order = req.body;

  createSumaVerification(order)
    .then(() => res.send('ok'))
    .catch(err => {
      console.error(err);
      res.status(500).send('error');
    });
});

// NEW: Customer creation webhook
router.post('/customer-created', async (req, res) => {
  console.log('[Shopify] Customer created webhook received');
  
  // Verify webhook authenticity
  if (!verifyShopifyHmac(req)) {
    console.error('[Shopify] Invalid HMAC');
    return res.status(401).send('Invalid HMAC');
  }

  const customer = req.body;
  console.log('[Shopify] Customer ID:', customer.id, 'Email:', customer.email);

  try {
    // Create SUMA verification session
    const verification = await createSumaVerification({
      customerId: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name
    });

    console.log('[SUMA] Verification created:', verification.id);

    // Send verification email to customer
    await sendVerificationEmail({
      to: customer.email,
      link: verification.verification_url
    });

    console.log('[Email] Verification email sent to:', customer.email);

    res.status(200).send('ok');
  } catch (error) {
    console.error('[Error] Customer verification flow failed:', error);
    res.status(500).send('error');
  }
});

export default router;