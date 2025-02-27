// controllers/userController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, findUserByEmail, createUser } = require("../models/user");
require("dotenv").config();

/**
 * POST /register
 * Register a new user AND auto-login by setting the cookie
 */
exports.registration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1) Check if user already exists by email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 2) Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    // 3) Generate JWT (just like in login)
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token expires in 1 hour
    );

    // 4) Set the token in a cookie
    // sameSite: "none" is important if your frontend is on a different port/domain
    // secure: false for local HTTP dev; set to true in production if using HTTPS
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour in ms
    });

    // 5) Return a 201 response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * POST /login
 * (Unchanged - it already sets the cookie)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * GET /isUserAuth
 */
exports.userAuth = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: req.user,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }
};

/**
 * GET /logout
 */
exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
