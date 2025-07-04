const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("📧 Sending to:", options.email);

    // 1) Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("✅ Email transporter ready");
    console.log("🔐 USER:", process.env.EMAIL_USER);

    // 2) Define mail options
    const mailOptions = {
      from: `"TravelWise Support" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message, // Use `text:` if sending plain text instead
    };

    // 3) Send mail
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err; // Important: re-throw so your `catchAsync` or controller handles it
  }
};

module.exports = sendEmail;
