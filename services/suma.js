import fetch from 'node-fetch';

// Authenticate with SUMA and get access token
async function getSumaAccessToken() {
  const res = await fetch(`${process.env.SUMA_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.SUMA_CLIENT_ID,
      client_secret: process.env.SUMA_CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`SUMA auth failed: ${error}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Create verification session
export async function createSumaVerification({ customerId, email, firstName, lastName }) {
  console.log('[SUMA] Creating verification for customer:', customerId);

  const token = await getSumaAccessToken();

  const res = await fetch(`${process.env.SUMA_BASE_URL}/v1/verifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      external_id: `shopify_customer_${customerId}`,
      email: email,
      first_name: firstName,
      last_name: lastName,
      redirect_url: `${process.env.APP_BASE_URL}/suma/callback`,
      webhook_url: `${process.env.APP_BASE_URL}/suma/webhook`
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`SUMA verification creation failed: ${error}`);
  }

  const data = await res.json();
  
  return {
    id: data.verification_id || data.id,
    verification_url: data.verification_url || data.url
  };
}