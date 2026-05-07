const { Resend } = require('resend');

// Resend uses HTTP API instead of SMTP — no port blocking issues on cloud hosts
const resend = new Resend(process.env.RESEND_API_KEY);

const sendContactNotification = async ({ name, email, message }) => {
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email notification');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  if (!to) {
    console.warn('No recipient email configured (NOTIFY_EMAIL or SMTP_USER)');
    return { success: false, error: 'No recipient configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to,
      subject: `New portfolio message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#2563EB">New message from your portfolio!</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px;font-weight:bold;width:80px">Name:</td>
              <td style="padding:8px">${name}</td>
            </tr>
            <tr style="background:#f9f9f9">
              <td style="padding:8px;font-weight:bold">Email:</td>
              <td style="padding:8px"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f0f4ff;border-radius:8px">
            <strong>Message:</strong>
            <p style="margin-top:8px;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin-top:20px;color:#666;font-size:13px">
            Sent at: ${new Date().toLocaleString()}<br/>
            View in admin panel to mark as read.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Email sent:', data.id);
    return { success: true };
  } catch (err) {
    console.error('Email error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { sendContactNotification };
