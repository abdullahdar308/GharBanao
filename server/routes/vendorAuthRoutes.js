// routes/vendorAuthRoutes.js

const router = require("express").Router();
const Vendor = require("../models/vendor");
const OTP = require("../models/Otp");
const { sendOTPEmail } = require("../utils/emailSender");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if vendor exists
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP
    await OTP.findOneAndDelete({ email });
    await new OTP({ email, otp, expiresAt }).save();

    // Send email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP
// Verify OTP
// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiration
    if (Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Delete OTP
    await OTP.findByIdAndDelete(otpRecord._id);

    // ✅ Find the vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // ✅ Generate JWT token with correct vendor ID
    const token = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Debugging logs
    console.log("Generated Token:", token);
    console.log("Vendor ID:", vendor._id);

    res.status(200).json({
      message: "Login successful",
      token,
      vendorId: vendor._id, // Sending the correct vendorId
    });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
