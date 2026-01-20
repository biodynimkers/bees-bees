import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailProps {
  email: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: SendPasswordResetEmailProps) {
  try {
    // Use Resend's onboarding domain for development/testing
    // In production, you can add your own verified domain
    const fromEmail =
      process.env.NODE_ENV === 'production'
        ? 'BEES Platform <noreply@resend.dev>' // Use your own domain when you have one
        : 'BEES Platform <onboarding@resend.dev>'; // Resend test domain

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Wachtwoord resetten - BEES Platform',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wachtwoord resetten</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px;
              }
              .header { 
                background-color: #f8f9fa; 
                padding: 20px; 
                text-align: center; 
                border-radius: 8px 8px 0 0;
              }
              .content { 
                background-color: white; 
                padding: 30px; 
                border: 1px solid #e9ecef;
              }
              .button { 
                display: inline-block; 
                background-color: #007bff; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
                font-weight: 600;
              }
              .footer { 
                background-color: #f8f9fa; 
                padding: 20px; 
                text-align: center; 
                font-size: 14px; 
                color: #6c757d;
                border-radius: 0 0 8px 8px;
              }
              .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; color: #333;">BEES Platform</h1>
              <p style="margin: 10px 0 0 0; color: #666;">Bijenbeheer Platform</p>
            </div>
            
            <div class="content">
              <h2>Hallo ${name},</h2>
              
              <p>U heeft een verzoek ingediend om uw wachtwoord te resetten voor uw BEES Platform account.</p>
              
              <p>Klik op de onderstaande knop om uw wachtwoord te wijzigen:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Wachtwoord resetten</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Belangrijk:</strong>
                <ul style="margin: 10px 0;">
                  <li>Deze link is geldig voor <strong>1 uur</strong></li>
                  <li>De link kan slechts <strong>één keer</strong> gebruikt worden</li>
                  <li>Heeft u dit verzoek niet ingediend? Negeer dan deze email</li>
                </ul>
              </div>
              
              <p>Als de knop niet werkt, kopieer dan deze link en plak hem in uw browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
              </p>
              
              <p>Met vriendelijke groet,<br>Het BEES Platform team</p>
            </div>
            
            <div class="footer">
              <p>Deze email is automatisch gegenereerd. Gelieve niet te antwoorden op deze email.</p>
              <p>BEES Platform - Uw digitale bijenbeheer assistent</p>
            </div>
          </body>
        </html>
      `,
      // Text fallback for email clients that don't support HTML
      text: `
Hallo ${name},

U heeft een verzoek ingediend om uw wachtwoord te resetten voor uw BEES Platform account.

Klik op deze link om uw wachtwoord te wijzigen:
${resetUrl}

Belangrijk:
- Deze link is geldig voor 1 uur
- De link kan slechts één keer gebruikt worden
- Heeft u dit verzoek niet ingediend? Negeer dan deze email

Met vriendelijke groet,
Het BEES Platform team

---
Deze email is automatisch gegenereerd. Gelieve niet te antwoorden op deze email.
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
    return data;
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw error;
  }
}
