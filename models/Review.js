const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/authMiddleware");

router.post("/:productId", auth, async (req, res) => {
  const review = new Review({
    user: req.user.id,
    product: req.params.productId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  await review.save();
  res.json(review);
});

module.exports = router;