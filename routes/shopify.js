import { v4 as uuidv4 } from 'uuid';
import { createSumaVerification } from '../services/suma.js';
import { sendEmail } from '../services/resend.js';
import { validateShopifyWebhook } from '../utils/verifyShopifySignature.js';

const handleShopifyCustomerCreate = async (req, res) => {
  try{
    if(!validateShopifyWebhook(req)) return res.status(401).send('invalid signature');

    // Shopify sends full object in body; customer may be in req.body
    const customer = req.body;
    const email = customer.email || customer.email_address || (customer.customer && customer.customer.email);
    const id = customer.id || (customer.customer && customer.customer.id);

    if(!email) return res.status(400).send('no email');

    const verificationId = uuidv4();

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
      html: `<p>Nuevo registro: ${email}<br>Shopify ID: ${id || 'N/A'}<br>Referencia: ${verificationId}</p>`
    });

    return res.status(200).json({ ok: true });
  } catch(err){
    console.error('shopify webhook error', err?.response?.data || err.message);
    return res.status(500).send('error');
  }
};

export default { handleShopifyCustomerCreate };
