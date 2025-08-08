const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, // your gmail address
    pass: process.env.SMTP_PASS, // your app password
  },
});

async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
