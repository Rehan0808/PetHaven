// controllers/petController.test.js
const petController = require("../controllers/petController");
const { Pet, sequelize } = require("../models");

// Mock the Pet model and sequelize
jest.mock("../models", () => ({
  Pet: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

describe("Pet Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
      file: undefined,
      user: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("filterPets", () => {
    it("should return pets and count", async () => {
      req.query = { limit: "10", page: "1", sort: "name,asc" };
      const dummyResult = { rows: [{ id: 1, name: "Buddy" }], count: 1 };
      Pet.findAndCountAll.mockResolvedValue(dummyResult);
      await petController.filterPets(req, res);
      expect(Pet.findAndCountAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        pets: dummyResult.rows,
        count: dummyResult.count,
      });
    });

    it("should handle errors", async () => {
      req.query = {};
      Pet.findAndCountAll.mockRejectedValue(new Error("DB error"));
      await petController.filterPets(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch pets",
        message: "DB error",
      });
    });
  });

  describe("getPet", () => {
    it("should return pet if found", async () => {
      req.params.id = "1";
      const dummyPet = { id: 1, name: "Buddy" };
      Pet.findByPk.mockResolvedValue(dummyPet);
      await petController.getPet(req, res);
      expect(Pet.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(dummyPet);
    });

    it("should return 404 if pet not found", async () => {
      req.params.id = "1";
      Pet.findByPk.mockResolvedValue(null);
      await petController.getPet(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pet not found" });
    });

    it("should handle errors", async () => {
      req.params.id = "1";
      Pet.findByPk.mockRejectedValue(new Error("DB error"));
      await petController.getPet(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch pet",
        message: "DB error",
      });
    });
  });

  describe("addPet", () => {
    it("should add a pet successfully", async () => {
      req.body = {
        name: "Buddy",
        species: "Dog",
        age: "3",
        fee: "50",
        description: "A dog",
        gender: "Male",
        zip: "12345",
        town: "Townsville",
      };
      req.file = { filename: "image.jpg" };
      req.user = { id: 1 };
      const createdPet = { id: 2, name: "Buddy" };
      Pet.create.mockResolvedValue(createdPet);
      await petController.addPet(req, res);
      expect(Pet.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Pet added successfully",
        pet: createdPet,
      });
    });

    it("should handle errors in addPet", async () => {
      // Provide complete body to avoid undefined errors on toLowerCase
      req.body = {
        name: "Buddy",
        species: "Dog",
        age: "3",
        fee: "50",
        description: "A dog",
        gender: "Male",
        zip: "12345",
        town: "Townsville",
      };
      // Force Pet.create to throw an error
      Pet.create.mockRejectedValue(new Error("Creation failed"));
      await petController.addPet(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unable to add pet",
        message: "Creation failed",
      });
    });
  });

  describe("deletePet", () => {
    it("should return 401 if user is not logged in", async () => {
      await petController.deletePet(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "User must be logged in" });
    });

    it("should return 404 if pet not found", async () => {
      req.user = { id: 1 };
      req.params.id = "1";
      Pet.findByPk.mockResolvedValue(null);
      await petController.deletePet(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pet not found" });
    });

    it("should return 403 if user is not owner", async () => {
      req.user = { id: 1 };
      req.params.id = "1";
      const pet = { id: 1, owner_id: 2 };
      Pet.findByPk.mockResolvedValue(pet);
      await petController.deletePet(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "You are not authorized to delete this pet",
      });
    });

    it("should delete pet if owner", async () => {
      req.user = { id: 1 };
      req.params.id = "1";
      const pet = { id: 1, owner_id: 1, destroy: jest.fn().mockResolvedValue() };
      Pet.findByPk.mockResolvedValue(pet);
      await petController.deletePet(req, res);
      expect(pet.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Pet deleted successfully",
        deletedPet: pet,
      });
    });

    it("should handle errors in deletePet", async () => {
      req.user = { id: 1 };
      req.params.id = "1";
      Pet.findByPk.mockRejectedValue(new Error("DB error"));
      await petController.deletePet(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Deletion failed",
        message: "DB error",
      });
    });
  });

  describe("updatePet", () => {
    it("should update pet successfully", async () => {
      req.params.id = "1";
      req.body = {
        name: "Updated Buddy",
        species: "Dog",
        age: "4",
        fee: "60",
        description: "Updated description",
        gender: "Male",
        zip: "54321",
        town: "New Town",
      };
      req.file = { filename: "newimage.jpg" };
      const pet = {
        id: 1,
        name: "Buddy",
        species: "dog",
        age: 3,
        fee: 50,
        description: "A dog",
        gender: "male",
        zip: 12345,
        town: "Townsville",
        image: "oldimage.jpg",
        update: jest.fn().mockResolvedValue(),
      };
      Pet.findByPk.mockResolvedValue(pet);
      await petController.updatePet(req, res);
      expect(pet.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Updated successfully",
        pet,
      });
    });

    it("should return 404 if pet not found in updatePet", async () => {
      req.params.id = "1";
      Pet.findByPk.mockResolvedValue(null);
      await petController.updatePet(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pet not found" });
    });

    it("should handle errors in updatePet", async () => {
      req.params.id = "1";
      Pet.findByPk.mockRejectedValue(new Error("DB error"));
      await petController.updatePet(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Update failed",
        message: "DB error",
      });
    });
  });

  describe("adoptPet", () => {
    it("should adopt pet successfully", async () => {
      req.params.id = "1";
      const dummyPet = { id: 1, update: jest.fn().mockResolvedValue() };
      Pet.findByPk.mockResolvedValue(dummyPet);
      // Mock sequelize.transaction to immediately execute the callback
      sequelize.transaction.mockImplementation(async (callback) => {
        await callback({});
      });
      await petController.adoptPet(req, res);
      expect(dummyPet.update).toHaveBeenCalledWith({ adopted: true }, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Pet adopted successfully",
      });
    });

    it("should handle errors in adoptPet", async () => {
      req.params.id = "1";
      sequelize.transaction.mockImplementation(async () => {
        throw new Error("Transaction error");
      });
      await petController.adoptPet(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Adoption process failed",
        details: "Transaction error",
      });
    });
  });
});
