const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    name: String,
    mobileNumber: String,
    address: String,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    },
  ],
  total: Number,
  discount: Number,
  paymentMethod: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Order", orderSchema);
