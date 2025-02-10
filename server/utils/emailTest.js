const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/../.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .sendMail({
    from: process.env.EMAIL_USER,
    to: "test@example.com",
    subject: "Test Email",
    text: "This is a test email",
  })
  .then(() => console.log("Email sent successfully!"))
  .catch((err) => console.error("Error:", err.message));
