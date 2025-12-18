import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail() {
  if (!process.env.NOTIFY_EMAIL) {
    throw new Error('NOTIFY_EMAIL not set');
  }

  await resend.emails.send({
    from: 'Connabis <onboarding@resend.dev>',
    to: process.env.NOTIFY_EMAIL,
    subject: '✅ Resend test email',
    html: '<p>Your email system is working.</p>',
  });
}
