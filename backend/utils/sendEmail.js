const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  // Create the transporter using Google SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email appearance
  const mailOptions = {
    from: `"HostelWala Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your HostelWala Account",
    html: `
      <div style="background-color: #111827; padding: 30px; border-radius: 12px; font-family: sans-serif; color: white; max-width: 500px; margin: auto;">
        <h2 style="color: #94a3b8; text-align: center;">Email Verification</h2>
        <p style="text-align: center; color: #d1d5db;">Please use the following code to complete your registration:</p>
        <div style="background: #1e293b; padding: 20px; text-align: center; border: 1px solid #334155; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f8fafc;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b; text-align: center;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email delivery failed");
  }
};

module.exports = sendOTP;
