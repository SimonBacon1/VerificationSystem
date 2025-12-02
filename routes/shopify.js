import { v4 as uuidv4 } from 'uuid';
import pool from '../services/db.js';
import { createSumaVerification } from '../services/suma.js';
import { sendEmail } from '../services/resend.js';
import { validateShopifyWebhook } from '../utils/verifyShopifySignature.js';

export async function handleShopifyCustomerCreate(req, res){
  try{
    if(!validateShopifyWebhook(req)) return res.status(401).send('invalid signature');

    const customer = req.body;
    const email = customer.email;
    const id = customer.id;

    const verificationId = uuidv4();
    await pool.query('INSERT INTO verifications(id, shopify_customer_id, email, status) VALUES($1,$2,$3,$4)', [verificationId, id, email, 'pending']);

    const sumaSession = await createSumaVerification({ email, reference: verificationId });

    const verificationUrl = sumaSession.url || `${process.env.VERIFICATION_HOST}/verify/${verificationId}`;
    const expires = new Date(Date.now() + Number(process.env.VERIFICATION_LINK_EXP_HOURS || 48) * 3600 * 1000).toISOString();

    await sendEmail({
      to: email,
      subject: 'Completa tu verificación de identidad',
      html: `<p>Hola,</p><p>Para completar tu registro, por favor realiza tu verificación desde tu teléfono usando el siguiente enlace:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>Este enlace expira el ${expires}.</p>`
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Nueva verificación iniciada',
      html: `<p>Nuevo registro: ${email}<br>Shopify ID: ${id}<br>Referencia: ${verificationId}</p>`
    });

    res.status(200).json({ ok: true });
  } catch(err){
    console.error('shopify webhook error', err?.response?.data || err.message);
    res.status(500).send('error');
  }
}
