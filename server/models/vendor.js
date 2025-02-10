// models/Vendor.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

// const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
