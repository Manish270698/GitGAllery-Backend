const { createTransport } = require("nodemailer");
const { config } = require("dotenv");
config();

const sendMail = async (to, subject, text) => {
  //   const transporter = createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });

  const transporter = createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });

  const message = { to, subject, text };
  await transporter.sendMail(message);
};

module.exports = sendMail;
