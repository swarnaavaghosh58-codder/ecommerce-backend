const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

/* =================================================
   CREATE PRODUCT (Admin Only)
================================================= */
router.post("/", verifyToken, admin, async (req, res) => {
  try {
    const { name, price, description, category, brand, stock, image } =
      req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name & Price are required" });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      brand,
      stock,
      image,
      user: req.user.id,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =================================================
   GET ALL PRODUCTS (Search + Filter + Pagination)
================================================= */
router.get("/", async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const category = req.query.category
      ? { category: req.query.category }
      : {};

    const minPrice = req.query.minPrice
      ? { price: { $gte: Number(req.query.minPrice) } }
      : {};

    const maxPrice = req.query.maxPrice
      ? { price: { $lte: Number(req.query.maxPrice) } }
      : {};

    const filter = {
      ...keyword,
      ...category,
      ...minPrice,
      ...maxPrice,
    };

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("reviews");

    res.status(200).json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =================================================
   GET SINGLE PRODUCT (With Reviews)
================================================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =================================================
   UPDATE PRODUCT (Admin Only)
================================================= */
router.put("/:id", verifyToken, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.stock = req.body.stock || product.stock;
    product.image = req.body.image || product.image;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =================================================
   DELETE PRODUCT (Admin Only)
================================================= */
router.delete("/:id", verifyToken, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;