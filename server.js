const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* ================================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

/* ================================
   DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

/* ================================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

/* ================================
   HTTP SERVER
================================ */
const server = http.createServer(app);

/* ================================
   SOCKET.IO
================================ */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ================================
   SOCKET AUTH (JWT VERIFY)
================================ */
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

/* ================================
   SOCKET CONNECTION
================================ */
io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.user.id);

  // Join private room
  socket.join(socket.user.id);

  // Admin room
  if (socket.user.role === "admin") {
    socket.join("admin-room");
  }

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.user.id);
  });
});

/* Make io available in routes */
app.set("io", io);

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});