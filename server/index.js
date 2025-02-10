// server/index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("./config/db");

// Import models
require("./models/vendor");
require("./models/Otp");
require("./models/product");
require("./models/orderModel"); // Add order model

// Import routes
const authRouter = require("./routes/authRoute");
const vendorRoute = require("./routes/vendorRoute");
const productRoute = require("./routes/productRoute");
const designRoutes = require("./routes/designRoute");
const vendorAuthRoutes = require("./routes/vendorAuthRoutes");
const orderRoutes = require("./routes/orderRoute"); // Add order routes

const app = express();

// 1) Middlewares
app.use(
  cors({
    origin: "https://ghar-banao-xi.vercel.app/login",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// 2) Routes
app.use("/api/auth", authRouter);
app.use("/api/vendor", vendorRoute);
app.use("/api/product", productRoute);
app.use("/api/designs", designRoutes);
app.use("/api/vendor", vendorAuthRoutes);
app.use("/api/orders", orderRoutes); // Add order routes

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3) Connect to MongoDB
connectToDatabase();

// 4) Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// 5) Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
