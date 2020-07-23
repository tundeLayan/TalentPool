const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.TALENT_POOL_SMTP_HOST,
    port: process.env.TALENT_POOL_SMTP_PORT,
    auth: {
      user: process.env.TALENT_POOL_SMTP_USER,
      pass: process.env.TALENT_POOL_SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.TALENT_POOL_EMAIL_FROM_NAME} <${process.env.TALENT_POOL_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  await transporter.sendMail(message);
};

module.exports = sendEmail;
