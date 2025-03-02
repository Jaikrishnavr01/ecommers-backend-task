const mongoose = require("mongoose"); // <-- Add this line

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    priceOld: Number,
    priceNew: Number,
    discount: Number,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiryDate: Date,
    imageUrl: String,
    uniqueUrl: { type: String, unique: true },
  });
  module.exports = mongoose.model("Product", productSchema);