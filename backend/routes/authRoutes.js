const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

{/*My changes */}
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");


{/* send otp to user verification */}
const sendOTP = require('../utils/sendEmail')
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer'); // ADD THIS AT THE TOP

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user & include password (if your schema hides it by default)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 3. Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 4. Send response with user details for the Navbar
    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
});

router.post('/signup', async(req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;

      // 1. Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      // 2. Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await Otp.findOneAndUpdate(
        { email: email.toLowerCase() },
        { otp, createdAt: Date.now() },
        { upsert: true, new: true },
      );

      // 3. Send OTP via Google SMTP
      await sendOTP(email, otp);

      // 4. Temporarily store data (e.g., in a session or a 'PendingUser' collection)
      // For now, we return success so the frontend knows to show the dialog
      res.status(200).json({
        message: "OTP sent to your email",
        tempToken: "optional_encrypted_payload", // You can send a token to verify later
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to send OTP. Check SMTP settings." });
    }
});

router.post("/verify-otp", async (req, res) => {
  try {
    // Normalize email to lowercase to match the Otp record
    const email = req.body.email.toLowerCase();
    const { name, phone, password, role, otp } = req.body;

    // 1. Find the OTP in the database
    // Using toString() handles cases where the OTP might arrive as a number
    const otpRecord = await Otp.findOne({
      email: email,
      otp: otp.toString(),
    });

    if (!otpRecord) {
      console.log(
        `Verification failed for ${email}. OTP ${otp} not found in DB.`,
      );
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user with verified status
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: true, // Matches your User.js schema
    });

    await newUser.save();

    // 4. Delete the OTP record now that it's used
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      message: "User verified and registered successfully!",
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});


// POST: Handle Hostel Booking Confirmation
router.post('/book-hostel', async (req, res) => {
  try {
    const { email, userName, hostelName, price } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"HostelWala" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed: ${hostelName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #1e293b;">Booking Confirmation</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your booking for <strong>${hostelName}</strong> has been successfully received!</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Hostel:</strong> ${hostelName}</p>
            <p style="margin: 5px 0;"><strong>Monthly Rent:</strong> ₹${price}</p>
          </div>
          <p>The hostel authority will contact you shortly on your registered phone number for further verification and room allocation.</p>
          <p>Best regards,<br/>The HostelWala Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Booking confirmed and email sent!" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to process booking" });
  }
});





router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

