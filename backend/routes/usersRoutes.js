// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

+ router.post("/register", userController.registration);
+ router.post("/login", userController.login);
+ router.get("/logout", userController.logout);
+ router.get("/isUserAuth", userController.userAuth);

module.exports = router;
