import express from 'express';
import { sendVerificationResultEmail } from '../services/email.js';

const router = express.Router();

// User redirect after completing verification (optional)
router.get('/callback', (req, res) => {
  const { status } = req.query;
  
  if (status === 'success') {
    res.send('<h1>✅ Verification Complete</h1><p>Your account is now active.</p>');
  } else {
    res.send('<h1>❌ Verification Failed</h1><p>Please contact support.</p>');
  }
});

// SUMA webhook for verification results
router.post('/webhook', express.json(), async (req, res) => {
  console.log('[SUMA Webhook] Received:', JSON.stringify(req.body, null, 2));

  try {
    const {
      verification_id,
      external_id,
      status,
      email,
      document_valid,
      face_match,
      liveness_passed,
      failure_reason
    } = req.body;

    // Extract Shopify customer ID from external_id
    const customerId = external_id?.replace('shopify_customer_', '');

    // Determine overall verification status
    const isVerified = status === 'completed' && 
                       document_valid === true && 
                       face_match === true && 
                       liveness_passed === true;

    // Send notification to Connabis admin
    await sendVerificationResultEmail({
      customerId,
      email,
      status: isVerified ? 'verified' : 'failed',
      reason: failure_reason || (isVerified ? null : 'One or more checks failed')
    });

    console.log('[SUMA Webhook] Notification email sent');

    // TODO: Update Shopify customer metafield with verification status
    // (Phase 3 - requires Shopify Admin API call)

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[SUMA Webhook] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;