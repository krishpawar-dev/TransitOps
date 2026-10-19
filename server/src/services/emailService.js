const nodemailer = require('nodemailer');

/**
 * Nodemailer transporter — configured from env variables.
 * Falls back to Ethereal (test) in development.
 */
let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: use Ethereal (fake SMTP)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Ethereal Email credentials:', testAccount.user, testAccount.pass);
  }

  return transporter;
};

/**
 * Send a license expiry reminder email to a driver.
 * @param {Object} driver - Mongoose Driver document
 * @param {number} daysLeft - Days until license expires
 */
const sendLicenseExpiryReminder = async (driver, daysLeft) => {
  try {
    if (!driver.email) return; // skip if no email

    const t = await getTransporter();
    const info = await t.sendMail({
      from: `"TransitOps" <${process.env.SMTP_FROM || 'noreply@transitops.com'}>`,
      to: driver.email,
      subject: `⚠️ License Expiry Reminder – ${driver.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">TransitOps</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">Smart Transport Operations Platform</p>
          </div>
          <div style="padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1E293B; margin-top: 0;">License Expiry Notice</h2>
            <p style="color: #475569;">Hello <strong>${driver.name}</strong>,</p>
            <p style="color: #475569;">Your driving license <strong>${driver.licenseNumber}</strong> will expire in 
              <span style="color: ${daysLeft <= 7 ? '#EF4444' : '#F59E0B'}; font-weight: bold;">${daysLeft} days</span>
              (on <strong>${new Date(driver.licenseExpiry).toLocaleDateString('en-IN')}</strong>).
            </p>
            <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #92400E;">
                ⚠️ Please renew your license before expiry to continue dispatch operations.
              </p>
            </div>
            <p style="color: #94A3B8; font-size: 13px;">This is an automated reminder from TransitOps Fleet Management System.</p>
          </div>
        </div>
      `,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (err) {
    console.error('Email send error:', err.message);
    // Non-blocking – don't throw
  }
};

/**
 * Send a generic email.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const t = await getTransporter();
  return t.sendMail({
    from: `"TransitOps" <${process.env.SMTP_FROM || 'noreply@transitops.com'}>`,
    to,
    subject,
    html,
    text,
  });
};

module.exports = { sendLicenseExpiryReminder, sendEmail };
