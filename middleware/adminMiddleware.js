const admin = require("../middleware/adminMiddleware");

router.delete("/:id", auth, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product Deleted" });
});