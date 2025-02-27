const express = require("express");
const router = express.Router();
const multer = require("multer");

// Require the Sequelize model for donation campaigns
const DonationCampaign = require("../models/donationCampaign");

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

// GET all donation campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await DonationCampaign.findAll();
    res.json({ data: campaigns });
  } catch (err) {
    console.error("Error fetching donation campaigns:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new campaign (with optional image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { petName, maxDonation, lastDate, shortInfo, longDescription } = req.body;
    let imagePath = req.file ? req.file.path : null;

    const newCampaign = await DonationCampaign.create({
      pet_name: petName,
      max_donation: maxDonation,
      last_date: lastDate,
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

// GET single campaign by ID
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

module.exports = router;
