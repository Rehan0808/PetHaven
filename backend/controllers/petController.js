// controllers/petController.js
const { Op } = require("sequelize");
const { Pet, Adoption, sequelize } = require("../models");

/**
 * Helper: Build dynamic WHERE clause for filterPets.
 */
const buildSequelizeWhereClause = (queryParams) => {
  const where = {};
  for (const [key, value] of Object.entries(queryParams)) {
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

const filterPets = async (req, res) => {
  try {
    const where = buildSequelizeWhereClause(req.query);
    let order = [];
    if (req.query.sort) {
      const [field, orderDir] = req.query.sort.split(",");
      order.push([
        field,
        orderDir && orderDir.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ]);
    }
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

const getPet = async (req, res) => {
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

const addPet = async (req, res) => {
  try {
    const { name, species, age, fee, description, gender, zip, town } = req.body;
    const imageFilename = req.file ? req.file.filename : null;
    const parsedAge = parseInt(age, 10) || 0;
    const parsedFee = parseFloat(fee) || 0;
    const parsedZip = zip ? parseInt(zip, 10) : null;
    const ownerId = req.user ? req.user.id : null;
    if (!ownerId) {
      return res.status(401).json({
        error: "No user ID found in request. Are you logged in?",
      });
    }
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
    res.status(400).json({
      error: "Update failed",
      message: err.message,
    });
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    if (!req.user || (pet.owner_id && pet.owner_id !== req.user.id)) {
      return res.status(403).json({
        error: "You do not own this pet",
      });
    }
    await pet.destroy();
    return res.status(200).json({
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
      const adoption = await Adoption.createAdoption(userId, petId, t);
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

module.exports = {
  filterPets,
  getPet,
  addPet,
  updatePet,
  deletePet,
  adoptPet,
};
