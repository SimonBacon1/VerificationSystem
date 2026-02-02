import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail() {
  return resend.emails.send({
    from: 'Connabis <no-reply@connabis.com.co>',
    to: process.env.NOTIFY_EMAIL,
    subject: 'Test email',
    html: '<strong>Email system working</strong>'
  });
}

export async function sendVerificationEmail({ to, link }) {
  console.log('[Email] Sending verification email to:', to);
  
  return resend.emails.send({
    from: 'Connabis <no-reply@connabis.com.co>',
    to,
    subject: 'Verify Your Age - Connabis',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Connabis</h2>
        <p>To complete your account setup, please verify your age and identity.</p>
        <p style="margin: 30px 0;">
          <a href="${link}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Now
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">
          This link will expire in 24 hours. If you didn't create an account with Connabis, 
          please ignore this email.
        </p>
      </div>
    `
  });
}

// NEW: Notification email to Connabis admin
export async function sendVerificationResultEmail({ customerId, email, status, reason }) {
  const statusEmoji = status === 'verified' ? '✅' : '❌';
  
  return resend.emails.send({
    from: 'Connabis System <no-reply@connabis.com.co>',
    to: process.env.NOTIFY_EMAIL,
    subject: `${statusEmoji} Customer Verification ${status.toUpperCase()}`,
    html: `
      <div style="font-family: monospace;">
        <h3>Verification Result</h3>
        <ul>
          <li><strong>Customer ID:</strong> ${customerId}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Status:</strong> ${status}</li>
          ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
          <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
        </ul>
      </div>
    `
  });
}