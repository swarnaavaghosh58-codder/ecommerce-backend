const express = require("express");
const Razorpay = require("razorpay");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", verifyToken, async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

module.exports = router;