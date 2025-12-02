import axios from 'axios';

const SUMA_BASE = process.env.SUMA_BASE || 'https://api.sumaverify.com/v1';
const SUMA_API_KEY = process.env.SUMA_API_KEY;

export async function createSumaVerification({ email, reference }){
  const payload = {
    callbackUrl: `${process.env.VERIFICATION_HOST}/suma/webhook`,
    type: ["document","face","liveness"],
    metadata: { userEmail: email, reference }
  };

  const resp = await axios.post(`${SUMA_BASE}/verifications`, payload, {
    headers: { Authorization: `Bearer ${SUMA_API_KEY}` }
  });

  return resp.data; // expected { verificationId, url }
}
