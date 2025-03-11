// routes/petsRoutes.js
const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");
const { optionalAuth } = require("../middleware/optionalAuth");

// GET all pets and POST a new pet. 
// POST uses optionalAuth so that if a user is logged in, owner_id is set; otherwise, it remains null.
router
  .route("/")
  .get(petController.filterPets)
  .post(optionalAuth, upload.single("image"), petController.addPet);

router
  .route("/:id")
  .get(petController.getPet)
  .put(upload.single("image"), petController.updatePet)
  // Use authenticate middleware so req.user is set, then check ownership in deletePet
  .delete(authenticate, petController.deletePet);

router.route("/:id/adopt").post(petController.adoptPet);

router.get("/test", (req, res) => {
  res.send("Pet route testing.");
});

module.exports = router;
