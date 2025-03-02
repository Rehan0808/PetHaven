// routes/petsRoutes.js
const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const upload = require("../middleware/upload");
const { optionalAuth } = require("../middleware/optionalAuth");

// GET all pets, POST new pet
router
  .route("/")
  .get(petController.filterPets)
  .post(optionalAuth, upload.single("image"), petController.addPet);

router
  .route("/:id")
  .get(petController.getPet)
  .put(upload.single("image"), petController.updatePet)
  .delete(petController.deletePet);

router.route("/:id/adopt").post(petController.adoptPet);

router.get("/test", (req, res) => {
  res.send("Pet route testing.");
});

module.exports = router;
