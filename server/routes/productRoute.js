// routes/productRoute.js
const express = require("express");
const multer = require("multer");
const Product = require("../models/product");
const Vendor = require("../models/vendor");

const router = express.Router();
const { vendorProtect } = require("../middlewares/vendorAuthMiddleware");

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Route to add a product
// Updated route with vendorProtect and proper vendorId assignment
router.post("/add", vendorProtect, upload.single("image"), async (req, res) => {
  const { name, category, description, price } = req.body; // Remove vendorId from destructuring
  const image = req.file ? req.file.path : null;

  try {
    const product = new Product({
      name,
      category,
      description,
      price,
      image,
      vendorId: req.vendor._id, // Get vendorId from middleware
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
});

// Route to update a product by ID
// Route to update a product by ID
router.put(
  "/update/:id",
  vendorProtect,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price } = req.body;
    const image = req.file ? req.file.path : null;

    try {
      // Find the product
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Ensure the vendor updating the product is the owner
      if (product.vendorId.toString() !== req.vendor._id.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this product" });
      }

      // Update allowed fields
      if (name) product.name = name;
      if (category) product.category = category;
      if (description) product.description = description;
      if (price) product.price = price;
      if (image) product.image = image;

      await product.save();

      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  }
);

// Route to fetch all products
router.get("/list", vendorProtect, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.vendor._id });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});
router.get("/userList", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});
// Fetch a product by name
router.get("/name/:name", async (req, res) => {
  try {
    const productName = req.params.name;
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by name:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

// Route to fetch a single product by ID
router.get("/:id", async (req, res) => {
  console.log("Fetching product with ID:", req.params.id);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

// Route to delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

module.exports = router;
