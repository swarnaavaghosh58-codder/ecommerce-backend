const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order) => {
  const invoiceDir = path.join(__dirname, "../invoices");

  // Create invoices folder if not exists
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const filePath = path.join(invoiceDir, `invoice-${order._id}.pdf`);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.text("Items:");
  order.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.product?.name || "Product"} - Qty: ${
        item.quantity
      }`
    );
  });

  doc.moveDown();
  doc.text(`Total Price: ₹${order.totalPrice}`);
  doc.text(`Status: ${order.status}`);

  doc.end();

  return filePath;
};

module.exports = generateInvoice;
