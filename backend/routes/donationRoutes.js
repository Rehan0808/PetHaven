// routes/donationRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const dayjs = require("dayjs");

// Import your DonationCampaign model from your models/index.js file
// Adjust the require path if needed.
const { DonationCampaign } = require("../models");

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/**
 * GET all donation campaigns
 */
router.get("/", async (req, res) => {
  try {
    const campaigns = await DonationCampaign.findAll();
    res.json({ data: campaigns });
  } catch (err) {
    console.error("Error fetching donation campaigns:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST a new donation campaign (with optional image)
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      petName,
      maxDonation,
      lastDate: userEnteredDate,
      shortInfo,
      longDescription,
    } = req.body;

    if (!petName || !maxDonation || !userEnteredDate || !shortInfo || !longDescription) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Parse the date. If the user enters a date like "22/2/2025", convert it to "YYYY-MM-DD".
    const parsedDate = dayjs(userEnteredDate, "D/M/YYYY").isValid()
      ? dayjs(userEnteredDate, "D/M/YYYY").format("YYYY-MM-DD")
      : userEnteredDate;

    const imagePath = req.file ? req.file.path : null;

    const newCampaign = await DonationCampaign.create({
      pet_name: petName,
      max_donation: parseFloat(maxDonation),
      last_date: parsedDate,
      short_info: shortInfo,
      long_description: longDescription,
      image_path: imagePath,
    });

    res.status(201).json({ data: newCampaign });
  } catch (err) {
    console.error("Error creating donation campaign:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET a single donation campaign by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const campaign = await DonationCampaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Donation campaign not found" });
    }
    res.json({ data: campaign });
  } catch (err) {
    console.error("Error fetching single campaign:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE a donation campaign by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await DonationCampaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Donation campaign not found" });
    }
    await campaign.destroy();
    res.json({ message: "Donation campaign deleted successfully" });
  } catch (err) {
    console.error("Error deleting donation campaign:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
