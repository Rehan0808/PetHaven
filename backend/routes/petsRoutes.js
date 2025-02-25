const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

// Require the upload middleware (multer config)
const upload = require("../middleware/upload");

// Route to adopt a pet by ID
router.route("/:id/adopt").post(petController.adoptPet);

// Test route (just to confirm server is running)
router.get("/test", (req, res) => {
  res.send("Pet route testing.");
});

// Main pet routes – attach upload.single("image") for file uploads on POST
router.route("/")
  .get(petController.filterPets)
  .post(upload.single("image"), petController.addPet);

// Single pet operations by ID
router.route("/:id")
  .get(petController.getPet)
  // ⭐ Now also handle an uploaded image on PUT
  .put(upload.single("image"), petController.updatePet)
  .delete(petController.deletePet);

module.exports = router; 