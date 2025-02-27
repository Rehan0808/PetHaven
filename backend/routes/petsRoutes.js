// routes/petsRoutes.js

const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const upload = require("../middleware/upload");

// NEW: Import your auth middleware
const authMiddleware = require("../middleware/auth");

// Route to adopt a pet by ID
router.route("/:id/adopt").post(petController.adoptPet);

// Test route (just to confirm server is running)
router.get("/test", (req, res) => {
  res.send("Pet route testing.");
});

// Main pet routes – attach upload.single("image") for file uploads on POST
router
  .route("/")
  .get(petController.filterPets)
  // Use authMiddleware here so req.user is set in addPet
  .post(authMiddleware, upload.single("image"), petController.addPet);

// Single pet operations by ID
router
  .route("/:id")
  .get(petController.getPet)
  .put(upload.single("image"), petController.updatePet)
  // Use authMiddleware here so req.user is set in deletePet
  .delete(authMiddleware, petController.deletePet);

module.exports = router;
