// backend/controllers/petController.js
const { Op } = require("sequelize");
const { Pet, Adoption, sequelize } = require("../models");

/**
 * Build dynamic WHERE clause for filterPets
 */
const buildSequelizeWhereClause = (queryParams) => {
  const where = {};
  for (const [key, value] of Object.entries(queryParams)) {
    // Skip these keys if they're sort/pagination
    if (["sort", "page", "limit"].includes(key)) continue;

    if (key === "species") {
      const speciesArray = Array.isArray(value) ? value : [value];
      where.species = { [Op.in]: speciesArray };
    } else if (key === "age") {
      where.age = +value;
    } else {
      where[key] = value;
    }
  }
  return where;
};

/**
 * GET /api/v1/pets
 * Returns an object shaped { pets, count } so your React code sees pets and count
 */
const filterPets = async (req, res) => {
  try {
    const where = buildSequelizeWhereClause(req.query);

    // Sorting
    let order = [];
    if (req.query.sort) {
      const [field, orderDir] = req.query.sort.split(",");
      order.push([
        field,
        orderDir && orderDir.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ]);
    }

    // Pagination defaults
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // Sequelize's findAndCountAll
    const result = await Pet.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    // Return { pets, count } to match your petSearchPage expectations
    return res.status(200).json({
      pets: result.rows,     // array of pet objects
      count: result.count,   // total number of matching pets
    });
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({
      error: "Failed to fetch pets",
      message: err.message,
    });
  }
};

/**
 * GET /api/v1/pets/:id
 */
const getPet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    return res.status(200).json(pet);
  } catch (err) {
    console.error("Error fetching pet:", err);
    res.status(500).json({
      error: "Failed to fetch pet",
      message: err.message,
    });
  }
};

/**
 * POST /api/v1/pets
 * If user is logged in (optionalAuth), sets owner_id = req.user.id, else null
 */
const addPet = async (req, res) => {
  try {
    let { name, species, age, fee, description, gender, zip, town } = req.body;

    // Convert to lowercase for validation
    species = species.toLowerCase();
    gender = gender.toLowerCase();

    const imageFilename = req.file ? req.file.filename : null;
    const parsedAge = parseInt(age, 10) || 0;
    const parsedFee = parseFloat(fee) || 0;
    const parsedZip = zip ? parseInt(zip, 10) : null;

    // If user is logged in, req.user is set by optionalAuth
    const ownerId = req.user ? req.user.id : null;

    const newPet = await Pet.create({
      name,
      species,
      age: parsedAge,
      fee: parsedFee,
      description,
      gender,
      zip: parsedZip,
      town,
      image: imageFilename,
      owner_id: ownerId,
    });

    return res.status(201).json({
      msg: "Pet added successfully",
      pet: newPet,
    });
  } catch (err) {
    console.error("Error adding pet:", err);
    return res.status(400).json({
      error: "Unable to add pet",
      message: err.message,
    });
  }
};

/**
 * PUT /api/v1/pets/:id
 */
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const imageFilename = req.file ? req.file.filename : pet.image;

    let { name, species, age, fee, description, gender, zip, town } = req.body;

    if (species) species = species.toLowerCase();
    if (gender) gender = gender.toLowerCase();

    const parsedAge = age ? parseInt(age, 10) : pet.age;
    const parsedFee = fee ? parseFloat(fee) : pet.fee;
    const parsedZip = zip ? parseInt(zip, 10) : null;

    await pet.update({
      name: name ?? pet.name,
      species: species ?? pet.species,
      age: parsedAge,
      fee: parsedFee,
      description: description ?? pet.description,
      gender: gender ?? pet.gender,
      zip: parsedZip === null && !zip ? null : parsedZip,
      town: town ?? pet.town,
      image: imageFilename,
    });

    return res.status(200).json({
      msg: "Updated successfully",
      pet,
    });
  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(400).json({
      error: "Update failed",
      message: err.message,
    });
  }
};

/**
 * DELETE /api/v1/pets/:id
 */
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    await pet.destroy();
    return res.status(200).json({
      msg: "Pet deleted successfully",
      deletedPet: pet,
    });
  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(500).json({
      error: "Deletion failed",
      message: err.message,
    });
  }
};

/**
 * POST /api/v1/pets/:id/adopt
 */
const adoptPet = async (req, res) => {
  try {
    const { userId } = req.body;
    const petId = req.params.id;
    await sequelize.transaction(async (t) => {
      const pet = await Pet.findByPk(petId, { transaction: t });
      if (!pet) {
        throw new Error("Pet not found");
      }
      await pet.update({ adopted: true }, { transaction: t });

      // If you have an Adoption model, you can handle it here
      // e.g., const adoption = await Adoption.createAdoption(userId, petId, t);

      res.status(200).json({
        success: true,
        message: "Pet adopted successfully",
        // adoption,
      });
    });
  } catch (error) {
    console.error("Error adopting pet:", error);
    res.status(500).json({
      success: false,
      error: "Adoption process failed",
      details: error.message,
    });
  }
};

module.exports = {
  filterPets,
  getPet,
  addPet,
  updatePet,
  deletePet,
  adoptPet,
};
