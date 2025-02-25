// controllers/petController.js
const { Op } = require("sequelize");
const Pet = require("../models/pet");
const adoptionModel = require("../models/adoption"); // If you have an adoption model
const sequelize = require("../config/sequelize"); // If you need transactions, etc.

/**
 * Helper: Build dynamic WHERE clause for filterPets
 */
const buildSequelizeWhereClause = (queryParams) => {
  const where = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (["sort", "page", "limit"].includes(key)) continue;

    if (key === "species") {
      // handle species array or exact match
      const speciesArray = Array.isArray(value) ? value : [value];
      where.species = { [Op.in]: speciesArray };
    } else if (key === "age") {
      // For simplicity, just do exact match
      where.age = +value;
    } else {
      // Fallback exact match
      where[key] = value;
    }
  }
  return where;
};

/**
 * GET and filter pets with pagination & sorting
 */
exports.filterPets = async (req, res) => {
  try {
    const where = buildSequelizeWhereClause(req.query);

    // Sorting
    let order = [];
    if (req.query.sort) {
      const [field, orderDir] = req.query.sort.split(",");
      order.push([field, orderDir && orderDir.toUpperCase() === "DESC" ? "DESC" : "ASC"]);
    }

    // Pagination
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const result = await Pet.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      data: result.rows,
      totalPetsResults: result.count,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch pets",
      message: err.message,
    });
  }
};

/**
 * GET a single pet by ID
 */
exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch pet",
      message: err.message,
    });
  }
};

/**
 * ADD a new pet (with optional image)
 * Called by POST /api/v1/pets (petsRoutes.js with upload.single("image"))
 */
exports.addPet = async (req, res) => {
  try {
    const { name, species, age, fee, description, gender, zip, town } = req.body;

    // If using Multer, req.file holds file info
    const imageFilename = req.file ? req.file.filename : null;

    // Parse numeric fields
    const parsedAge = parseInt(age, 10) || 0;
    const parsedFee = parseFloat(fee) || 0;
    const parsedZip = zip ? parseInt(zip, 10) : null;

    // Create the new Pet record
    const newPet = await Pet.create({
      name,
      species, // 'dog', 'cat', etc. (lowercase if your model expects that)
      age: parsedAge,
      fee: parsedFee,
      description,
      gender, // 'male' or 'female'
      zip: parsedZip,
      town,
      image: imageFilename,
      // 'adopted' defaults to false in your model
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
 * UPDATE a pet by ID
 */
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // 1) If using Multer, req.file holds the new file (or undefined if none)
    //    Keep old image if none is uploaded
    const imageFilename = req.file ? req.file.filename : pet.image;

    // 2) Extract fields from req.body
    let { name, species, age, fee, description, gender, zip, town } = req.body;

    // 3) Convert species/gender to lowercase if needed (like addPet does)
    if (species) {
      species = species.toLowerCase();
    }
    if (gender) {
      gender = gender.toLowerCase();
    }

    // 4) Parse numeric fields or fallback to old values
    const parsedAge = age ? parseInt(age, 10) : pet.age;
    const parsedFee = fee ? parseFloat(fee) : pet.fee;
    const parsedZip = zip ? parseInt(zip, 10) : null;

    // 5) Update only the fields we have; fallback to old fields if undefined
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
    res.status(400).json({
      error: "Update failed",
      message: err.message,
    });
  }
};

/**
 * DELETE a pet by ID
 */
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    await pet.destroy();
    res.status(200).json({
      msg: "Pet deleted successfully",
      deletedPet: pet,
    });
  } catch (err) {
    res.status(500).json({
      error: "Deletion failed",
      message: err.message,
    });
  }
};

/**
 * ADOPT a pet
 * Example usage: POST /api/v1/pets/:id/adopt with { userId }
 */
exports.adoptPet = async (req, res) => {
  try {
    const { userId } = req.body;
    const petId = req.params.id;

    // If you use a transaction:
    await sequelize.transaction(async (t) => {
      const pet = await Pet.findByPk(petId, { transaction: t });
      if (!pet) {
        throw new Error("Pet not found");
      }
      // Mark pet as adopted
      await pet.update({ adopted: true }, { transaction: t });

      // If you have an adoption model:
      const adoption = await adoptionModel.createAdoption(userId, petId, t);

      res.status(200).json({
        success: true,
        message: "Pet adopted successfully",
        adoption,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Adoption process failed",
      details: error.message,
    });
  }
};