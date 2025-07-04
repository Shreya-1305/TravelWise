/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cityRoutes = require("./routes/cityRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// ✅ CORS Setup
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight for all routes

// ✅ Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Dev Logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cities", cityRoutes);

// ✅ Handle unknown routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ✅ Global error handler
app.use(globalErrorHandler);

module.exports = app;
