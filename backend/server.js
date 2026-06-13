require("dotenv").config();
const dns = require("dns");
// Force Google DNS to resolve MongoDB Atlas hostnames
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Voucher = require("./models/Voucher");
const Category = require("./models/Category");
const User = require("./models/User");
const CartItem = require("./models/CartItem");
const auth = require("./middleware/auth");
const voucherRoutes = require("./routes/voucherRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authController = require("./controllers/authController");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Use the centralized voucher routes
app.use("/api/vouchers", voucherRoutes);

// Use the centralized cart routes
app.use("/api/cart", cartRoutes);

// GET: Fetch all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a category (for testing purposes)
app.post("/api/categories", async (req, res) => {
  try {
    const { name, description, isActive } = req.body; 
    const category = new Category({ name, description, isActive });
    await category.save();
    res.status(201).json({ message: "Category created successfully", categoryId: category._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auth Routes
app.post("/api/users/register", authController.signup);
app.post("/api/users/login", authController.login);
app.get("/api/users/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
