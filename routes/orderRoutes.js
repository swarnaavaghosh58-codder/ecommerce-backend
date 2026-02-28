const PDFDocument = require("pdfkit");
const path = require("path");

router.get("/:id/invoice", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      order.user._id.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const gstRate = 0.18;
    const gstAmount = order.totalPrice * gstRate;
    const finalAmount = order.totalPrice + gstAmount;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Company Logo
    const logoPath = path.join(__dirname, "../assets/logo.png");
    doc.image(logoPath, 50, 45, { width: 100 });

    doc.fontSize(20).text("ShopMart Pvt Ltd", 200, 50);
    doc.fontSize(10).text("GSTIN: 22AAAAA0000A1Z5", 200, 70);

    doc.moveDown(4);

    doc.fontSize(14).text("Invoice Details", { underline: true });
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Email: ${order.user.email}`);
    doc.moveDown();

    doc.text("Items:", { underline: true });
    order.items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.product.name} - ₹${item.product.price} x ${
          item.quantity
        }`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${order.totalPrice}`);
    doc.text(`GST (18%): ₹${gstAmount.toFixed(2)}`);
    doc.text(`Total: ₹${finalAmount.toFixed(2)}`);
    doc.text(`Status: ${order.status}`);

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const io = req.app.get("io");

io.to(order.user.toString()).emit("orderUpdated", order);
io.to("admin-room").emit("adminOrderUpdated", order);