// middleware/optionalAuth.test.js
const jwt = require("jsonwebtoken");
const { optionalAuth } = require("../middleware/optionalAuth");
const { User } = require("../models");

// Mock the User model's findByPk method.
jest.mock("../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe("Optional Authentication Middleware (optionalAuth)", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "testsecret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should call next without setting req.user if no token is provided", async () => {
    const req = { header: jest.fn().mockReturnValue("") };
    const next = jest.fn();
    
    await optionalAuth(req, {}, next);
    
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it("should set req.user if a valid token is provided", async () => {
    const user = { id: 2, username: "optionalUser" };
    const token = jwt.sign({ id: 2 }, process.env.JWT_SECRET, { expiresIn: "1h" });
    User.findByPk.mockResolvedValue(user);
    
    const req = { header: jest.fn().mockReturnValue(`Bearer ${token}`) };
    const next = jest.fn();
    
    await optionalAuth(req, {}, next);
    
    expect(User.findByPk).toHaveBeenCalledWith(2, { attributes: { exclude: ["password", "refresh_token"] } });
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it("should call next without setting req.user if the token is invalid", async () => {
    const req = { header: jest.fn().mockReturnValue("Bearer invalidtoken") };
    const next = jest.fn();
    
    await optionalAuth(req, {}, next);
    
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
