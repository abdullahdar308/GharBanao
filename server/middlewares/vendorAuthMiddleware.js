const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor");

const vendorProtect = async (req, res, next) => {
  try {
    console.log("Headers:", req.headers); // Debugging: Check headers

    const token = req.headers.authorization?.split(" ")[1]; // Get token
    if (!token) throw new Error("No token provided");

    console.log("Token received:", token); // Debugging: Check if token is received

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging: Check decoded token

    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) throw new Error("Vendor not found");

    console.log("Vendor found:", vendor.email); // Debugging: Check if vendor is found

    req.vendor = vendor; // Attach vendor to request
    next();
  } catch (error) {
    console.error("Authorization error:", error.message); // Debugging: Log errors
    res.status(401).json({
      message: "Not authorized",
      error: error.message,
    });
  }
};

module.exports = { vendorProtect };
