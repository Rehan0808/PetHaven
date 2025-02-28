// routes/petsRoutes.js
const express = require("express");
const router = express.Router();
// const multer = require("multer");
const petController = require("../controllers/petController");
const upload = require("../middleware/upload");


// const upload = multer({ dest: "uploads/" }); // or your own config

router.post("/", upload.single("image"), petController.addPet);
// ...
module.exports = router;
// Destructure the authenticate function from the auth module
const { authenticate } = require("../middleware/auth");

// Route to adopt a pet by ID
router.route("/:id/adopt").post(petController.adoptPet);

// Test route to confirm pet routes are active
router.get("/test", (req, res) => {
  res.send("Pet route testing.");
});

// Main pet routes: GET for filtering, POST for adding a new pet (with image upload)
router
  .route("/")
  .get(petController.filterPets)
  .post(authenticate, upload.single("image"), petController.addPet);

// Routes for operations on a single pet (by ID)
router
  .route("/:id")
  .get(petController.getPet)
  .put(upload.single("image"), petController.updatePet)
  .delete(authenticate, petController.deletePet);

module.exports = router;
