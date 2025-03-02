const express = require("express");
const Product = require("../models/Product");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

// Create a product (Only Admins and Vendors)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res.status(403).json({ error: "Access Denied. Only admins and vendors can create products." });
    }

    const { name, description, category, priceOld, priceNew, imageUrl } = req.body;

    const discount = ((priceOld - priceNew) / priceOld) * 100;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const uniqueUrl = `${name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;
    
    const vendorId = req.user.id; // Assign vendor automatically

    const product = new Product({
      name,
      description,
      category,
      priceOld,
      priceNew,
      discount: discount.toFixed(2),
      vendor: vendorId,
      expiryDate,
      imageUrl,
      uniqueUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
    try {
      const products = await Product.find().populate("vendor", "name email");
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.put("/:id", verifyToken, async (req, res) => {
    try {
      if (!["admin", "staff", "vendor"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access Denied. Only admins, staff, and vendors can edit products." });
      }
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      if (!["admin", "staff", "vendor"].includes(req.user.role)) {
        return res.status(403).json({ error: "Access Denied. Only admins, staff, and vendors can delete products." });
      }
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
module.exports = router;
