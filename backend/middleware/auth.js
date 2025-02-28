// middleware/auth.js
const jwt = require("jsonwebtoken");
const { asyncHandler, ErrorResponse } = require("../utils");
const { User } = require("../models");

/**
 * **Authentication middleware**
 * Checks for a token in cookies or the Authorization header.
 * Verifies it using process.env.JWT_SECRET.
 * Attaches the user to req.user if valid.
 */
exports.authenticate = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    "";

  if (!token) {
    throw new ErrorResponse(401, "auth_error", "Access token is required");
  }

  // Use the same variable name as in your .env
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  try {
    // By default, your login code signs with { id: user.id }
    // So we expect decoded.id for the user ID
    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "refresh_token"] },
    });

    if (!user) {
      throw new ErrorResponse(401, "auth_error", "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err?.message === "jwt expired") {
      throw new ErrorResponse(401, "auth_error", "Token expired");
    }
    throw new ErrorResponse(400, "auth_error", "Invalid token");
  }
});
