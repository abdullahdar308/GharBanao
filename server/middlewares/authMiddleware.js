// server/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    console.log("Received headers:", req.headers);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("No authorization header found");
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token payload:", decoded);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      console.log("User not found for email:", decoded.email);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { email: user.email };
    console.log("Authentication successful for:", user.email);
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      message: "Authorization failed",
      error: error.message,
      // token: token // This will show the problematic token
    });
  }
};

module.exports = { protect };
