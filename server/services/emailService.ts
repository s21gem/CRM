import nodemailer from 'nodemailer';

// Configure the SMTP transport using environment variables.
// Users can provide their own Gmail (with App Password) or other SMTP providers.
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'your.email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"FoneBox Security Operations" <${process.env.SMTP_USER || 'your.email@gmail.com'}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't crash the server if email fails (often credentials aren't set up yet)
    return false;
  }
};
