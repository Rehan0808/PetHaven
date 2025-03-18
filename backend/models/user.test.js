// models/user.test.js

// Import the model definition function
const defineUserModel = require('./user');

describe("User Model Static Methods", () => {
  let User;

  // Suppress console.error output for tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    // Create a dummy Sequelize object with a `define` function.
    const dummySequelize = {
      define: (modelName, attributes, options) => {
        // Return an empty object to simulate a model.
        return {};
      }
    };

    // Create a dummy DataTypes object.
    const dummyDataTypes = {
      INTEGER: "INTEGER",
      STRING: (length) => `STRING(${length})`
    };

    // Define the User model using the dummy objects.
    User = defineUserModel(dummySequelize, dummyDataTypes);
  });

  describe("findUserByEmail", () => {
    it("should call findOne with the correct query and return the user if found", async () => {
      // Create a mock for findOne that resolves with a dummy user.
      const findOneMock = jest.fn().mockResolvedValue({ id: 1, email: "test@example.com" });
      // Override the findOne method on the User model.
      User.findOne = findOneMock;
      const email = "test@example.com";

      // Call the static method.
      const result = await User.findUserByEmail(email);

      // Verify that findOne was called with the correct parameters.
      expect(findOneMock).toHaveBeenCalledWith({ where: { email } });
      // Verify that the method returns the dummy user.
      expect(result).toEqual({ id: 1, email: "test@example.com" });
    });

    it("should return null if findOne throws an error", async () => {
      // Create a mock for findOne that rejects with an error.
      const findOneMock = jest.fn().mockRejectedValue(new Error("Database error"));
      User.findOne = findOneMock;
      const email = "fail@example.com";

      // Call the static method; since the error is caught, it should return null.
      const result = await User.findUserByEmail(email);

      // Verify that findOne was called with the correct parameters.
      expect(findOneMock).toHaveBeenCalledWith({ where: { email } });
      // Verify that the method returns null in case of an error.
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should call create with the provided user data and return the new user", async () => {
      // Create a mock for create that resolves with a dummy user.
      const createMock = jest.fn().mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com"
      });
      User.create = createMock;
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword"
      };

      // Call the static createUser method.
      const result = await User.createUser(userData);

      // Verify that create was called with the correct user data.
      expect(createMock).toHaveBeenCalledWith(userData);
      // Verify that the method returns the dummy user data.
      expect(result).toEqual({
        id: 1,
        username: "testuser",
        email: "test@example.com"
      });
    });

    it("should throw an error if create fails", async () => {
      // Create a mock for create that rejects with an error.
      const error = new Error("Creation Error");
      const createMock = jest.fn().mockRejectedValue(error);
      User.create = createMock;
      const userData = {
        username: "failuser",
        email: "fail@example.com",
        password: "hashedPassword"
      };

      // Expect the createUser method to throw an error when create fails.
      await expect(User.createUser(userData)).rejects.toThrow("Creation Error");
    });
  });
});
