const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");
const app = express();

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'connected'
  })
})


app.use(express.json()); // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/inventory", inventoryRoutes);

module.exports = app;