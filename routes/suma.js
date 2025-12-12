import pool from '../services/db.js';
import { sendEmail } from '../services/resend.js';
import { getCustomerByEmail, tagCustomer } from '../services/shopify.js';

const handleSumaWebhook = async (req, res) => {
  try{
    const payload = req.body;
    const status = payload.status || payload.result || 'unknown';
    const sumaId = payload.verificationId || payload.id || payload.verification_id;
    const metadata = payload.metadata || {};
    const reference = metadata.reference;
    const userEmail = metadata.userEmail || metadata.email || payload.email;

    if(reference){
      await pool.query('UPDATE verifications SET status=$1, suma_id=$2, raw_response=$3, updated_at=now() WHERE id=$4', [status, sumaId, payload, reference]);
    }

    let subject, message;
    if(status === 'approved' || status === 'success' || status === 'passed'){
      subject = 'Verificación Aprobada';
      message = 'Hola, tu verificación ha sido aprobada. ¡Gracias!';
    } else if(status === 'manual_review'){
      subject = 'Verificación en Revisión Manual';
      message = 'Hola, tu verificación está siendo revisada por nuestro equipo. Te contactaremos pronto.';
    } else {
      subject = 'Verificación Fallida';
      message = 'Hola, tu verificación no pudo ser aprobada. Por favor intenta nuevamente o contacta soporte.';
    }

    if(userEmail){
      await sendEmail({ to: userEmail, subject, html: `<p>${message}</p>` });
    }

    await sendEmail({ to: process.env.ADMIN_EMAIL, subject: `Resultado de verificación: ${status}`, html: `<p>Usuario: ${userEmail}<br>Referencia: ${reference || 'N/A'}<br>SUMA ID: ${sumaId || 'N/A'}<br><pre>${JSON.stringify(payload,null,2)}</pre></p>` });

    const customer = userEmail ? await getCustomerByEmail(userEmail) : null;
    if(customer){
      if(status === 'approved' || status === 'success' || status === 'passed'){
        await tagCustomer(customer.id, 'Verified');
      } else {
        await tagCustomer(customer.id, 'Urgent');
      }
    }

    return res.status(200).json({ ok: true });
  } catch(err){
    console.error('suma webhook error', err?.response?.data || err.message);
    return res.status(500).send('error');
  }
};

export default { handleSumaWebhook };
