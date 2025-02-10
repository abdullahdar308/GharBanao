// routes/vendorRoute.js
const express = require("express");
const Vendor = require("../models/vendor");
const router = express.Router();

// // Middleware to check if the user is an admin (assume middleware is implemented)
// const checkAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Access denied. Admins only." });
//   }
// };

// Route to add a vendor
router.post("/add",  async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if a vendor with the same email already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor with this email already exists." });
    }

    const vendor = new Vendor({ name, email });
    await vendor.save();

    res.status(201).json({ message: "Vendor added successfully", vendor });
  } catch (error) {
    console.error("Error in /api/vendor/add:", error);
    res.status(500).json({ message: "Error adding vendor", error: error.message });
  }
});
// Route to fetch all vendors
router.get("/list", async (req, res) => {
    try {
      const vendors = await Vendor.find({});
      res.status(200).json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching vendors", error: error.message });
    }
  });
  

module.exports = router;
