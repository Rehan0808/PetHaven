const jwt = require("jsonwebtoken");
const { client } = require("../config/db"); // Add PostgreSQL client
require("dotenv").config();

module.exports = async (req, res, next) => {
  // 1. Extract token from cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "Access denied. No authentication token provided." 
    });
  }

  try {
    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Check if user exists in PostgreSQL
    const userQuery = await client.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userQuery.rows.length === 0) {
      res.clearCookie("token");
      return res.status(401).json({
        success: false,
        error: "Invalid token - user not found"
      });
    }

    // 4. Attach user to request
    req.user = userQuery.rows[0];
    next();

  } catch (err) {
    // Handle different error types
    res.clearCookie("token");
    
    const errorResponse = {
      success: false,
      error: "Invalid or expired authentication token",
      details: err.message
    };

    if (err.name === "TokenExpiredError") {
      errorResponse.error = "Session expired - Please login again";
    }

    return res.status(401).json(errorResponse);
  }
};