// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const petRouter = require("./routes/petsRoutes");
const userRouter = require("./routes/usersRoutes");
const donationRouter = require("./routes/donationRoutes");
const paymentRouter = require("./routes/paymentRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "client/build")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => res.send("The server is online."));
app.use("/api/v1/pets", petRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/donations", donationRouter);
app.use("/payment", paymentRouter);

// Catch-all for React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  if (err.statusCode && err.errorCode && err.message) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
    });
  }
  res.status(500).json({
    error: "server_error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
