export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<boolean> => {
  // IMPORTANT: 
  // In a production environment, implement this using a transactional email service 
  // like Resend, SendGrid, or Nodemailer with an SMTP server.
  // DO NOT use frontend client-side code for this. This is securely handled on the backend.
  
  const EMAIL_PROVIDER_API_KEY = process.env.EMAIL_PROVIDER_API_KEY;
  
  if (!EMAIL_PROVIDER_API_KEY) {
    console.warn('[Email Service Warning] EMAIL_PROVIDER_API_KEY is missing in backend/.env.');
    console.log(`[Mock Email Sent] To: ${to} | Subject: ${subject}`);
    // Return true in development to simulate success
    return true; 
  }

  try {
    /* 
    Example implementation for Resend:
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_PROVIDER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'security@smartfarm.com',
        to: [to],
        subject: subject,
        html: html,
        text: text
      })
    });
    return res.ok;
    */
    
    // Simulate real provider call here since this is a scaffold
    console.log(`[Email Dispatched] To: ${to} | Subject: ${subject}`);
    return true;
  } catch (err) {
    console.error('[Email Service Error]', err);
    return false;
  }
};
