import crypto from 'crypto';

export function validateShopifyWebhook(req){
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if(!secret) return true;
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const raw = req.rawBody || Buffer.from(JSON.stringify(req.body));
  const digest = crypto.createHmac('sha256', secret).update(raw).digest('base64');
  try{
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  }catch(e){
    return false;
  }
}
