// backend/routes/donationRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const dayjs = require("dayjs"); // <-- NEW

// Require the Sequelize model for donation campaigns
// NOTE: If you have a models/index.js, adjust import accordingly
const DonationCampaign = require("../models").DonationCampaign;

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
    const {
      petName,
      maxDonation,
      lastDate: userEnteredDate, // rename for clarity
      shortInfo,
      longDescription,
    } = req.body;

    // If user typed date like "22/2/2025", parse it into "YYYY-MM-DD"
    // dayjs("22/2/2025", "D/M/YYYY") => "2025-02-22"
    const parsedDate = dayjs(userEnteredDate, "D/M/YYYY").isValid()
      ? dayjs(userEnteredDate, "D/M/YYYY").format("YYYY-MM-DD")
      : userEnteredDate; // fallback if it’s already in YYYY-MM-DD

    const imagePath = req.file ? req.file.path : null;

    const newCampaign = await DonationCampaign.create({
      pet_name: petName,
      max_donation: maxDonation,
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
