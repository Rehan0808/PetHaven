// backend/middleware/optionalAuth.js
// If you want to require the user to be logged in on the server side for delete,
// you can do router.delete("/:id", optionalAuth, petController.deletePet);
// then in deletePet, check if (!req.user)...

const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    let token = "";

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "refresh_token"] },
    });

    if (user) {
      req.user = user;
    }
  } catch (err) {
    // do nothing if invalid/expired token
  }
  next();
};
