const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure, // true for 465, false for 587
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to,
    subject,
    html
  });
};

module.exports = { sendMail };