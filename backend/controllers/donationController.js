// controllers/donationController.js
const { DonationCampaign } = require("../models");
const fs = require("fs");
const dayjs = require("dayjs");
const path = require("path");

// GET all donation campaigns
exports.getAllDonations = async (req, res) => {
  try {
    const campaigns = await DonationCampaign.findAll();
    res.json({ data: campaigns });
  } catch (err) {
    console.error("Error fetching donation campaigns:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE a new donation campaign (POST)
exports.createDonation = async (req, res) => {
  try {
    const { petName, maxDonation, shortInfo, longDescription } = req.body;

    // Basic validation
    if (!petName || !maxDonation || !shortInfo || !longDescription) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // If file was uploaded, store path
    const imagePath = req.file ? req.file.path : null;

    // Always set a default date for last_date so it won't be NULL
    // e.g., "today"
    const newCampaign = await DonationCampaign.create({
      pet_name: petName,
      max_donation: parseFloat(maxDonation),
      last_date: new Date(), // <--- default date/time
      short_info: shortInfo,
      long_description: longDescription,
      image_path: imagePath,
    });

    res.status(201).json({ data: newCampaign });
  } catch (err) {
    console.error("Error creating donation campaign:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET a single donation campaign by ID
exports.getOneDonation = async (req, res) => {
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
};

// UPDATE an existing donation campaign (PUT)
exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { petName, maxDonation, lastDate, shortInfo, longDescription } = req.body;

    const campaign = await DonationCampaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ error: "Donation campaign not found" });
    }

    // If a new image was uploaded, remove the old one if it exists
    if (req.file) {
      if (campaign.image_path) {
        fs.unlink(campaign.image_path, (err) => {
          if (err) console.error("Error removing old image:", err);
        });
      }
      campaign.image_path = req.file.path;
    }

    // If user provides lastDate, let them update it
    if (lastDate) {
      let parsedDate = dayjs(lastDate, "D/M/YYYY");
      if (!parsedDate.isValid()) {
        parsedDate = dayjs(lastDate);
      }
      if (!parsedDate.isValid()) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      campaign.last_date = parsedDate.toDate();
    }

    // Update fields if provided
    if (petName) campaign.pet_name = petName;
    if (maxDonation) campaign.max_donation = parseFloat(maxDonation);
    if (shortInfo) campaign.short_info = shortInfo;
    if (longDescription) campaign.long_description = longDescription;

    await campaign.save();
    res.json({ data: campaign });
  } catch (err) {
    console.error("Error updating donation campaign:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a donation campaign
exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await DonationCampaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ error: "Donation campaign not found" });
    }

    // Remove the associated image if it exists
    if (campaign.image_path) {
      fs.unlink(campaign.image_path, (err) => {
        if (err) console.error("Error removing image:", err);
      });
    }

    await campaign.destroy();
    res.json({ message: "Donation campaign deleted successfully" });
  } catch (err) {
    console.error("Error deleting donation campaign:", err);
    res.status(500).json({ error: "Server error" });
  }
};
