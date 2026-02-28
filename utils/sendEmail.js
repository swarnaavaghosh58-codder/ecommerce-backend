const nodemailer = require("nodemailer");

const sendEmailWithAttachment = async (to, subject, text, pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
      },
    ],
  });
};

module.exports = sendEmailWithAttachment;
const sendEmail = require("../utils/sendEmail");
await sendEmail(
  req.user.email,
  "Order Confirmation",
  "Your order is confirmed!"
);