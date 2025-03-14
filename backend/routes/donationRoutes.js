// routes/donationRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // your multer config
const donationController = require("../controllers/donationController");

// GET all donation campaigns
router.get("/", donationController.getAllDonations);

// CREATE new campaign (with optional image)
router.post("/", upload.single("image"), donationController.createDonation);

// GET single donation campaign by ID
router.get("/:id", donationController.getOneDonation);

// UPDATE existing donation campaign (PUT) with optional new image
router.put("/:id", upload.single("image"), donationController.updateDonation);

// DELETE a donation campaign
router.delete("/:id", donationController.deleteDonation);

module.exports = router;
