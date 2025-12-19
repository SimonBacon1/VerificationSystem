import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Connabis <no-reply@connabis.com.co>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

export async function sendTestEmail() {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: [NOTIFY_EMAIL],
    subject: '✅ Test email – Verification System',
    html: '<p>El sistema de correos está funcionando correctamente.</p>',
  });
}

export async function sendVerificationEmail({ to, verificationUrl }) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: 'Verifica tu identidad – Connabis',
    html: `
      <p>Hola,</p>
      <p>Para continuar con tu verificación, haz clic en el siguiente enlace:</p>
      <p><a href="${verificationUrl}">Verificar ahora</a></p>
      <p>Si no solicitaste esto, puedes ignorar este correo.</p>
    `,
  });
}
