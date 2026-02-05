const nodemailer = require('nodemailer');

// Moved transporter out of the function — was getting recreated on every call
// which caused silent failures and weird smtp state issues
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendContactNotification = async ({ name, email, message }) => {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
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
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendContactNotification };
