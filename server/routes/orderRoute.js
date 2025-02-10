const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const { vendorProtect } = require("../middlewares/vendorAuthMiddleware");

// Create new order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

// Get orders for a vendor
router.get("/vendor", vendorProtect, async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendorId": req.vendor._id,
    }).sort({ date: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

module.exports = router;
