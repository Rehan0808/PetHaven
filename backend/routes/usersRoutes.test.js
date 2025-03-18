// routes/usersRoutes.test.js
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Mock the userController to isolate route behavior
jest.mock("../controllers/userController", () => ({
  registration: jest.fn((req, res) =>
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: "fakeToken",
      user: { id: 1, username: req.body.username, email: req.body.email }
    })
  ),
  login: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: "fakeLoginToken",
      user: { id: 1, username: "testUser", email: req.body.email }
    })
  ),
  logout: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })
  ),
  userAuth: jest.fn((req, res) => {
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: "User is authenticated",
        user: req.user
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated"
      });
    }
  })
}));

// Import the routes after mocking controllers
const usersRoutes = require("./usersRoutes");

// Create an Express app for testing the routes
const createTestApp = (middleware = []) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cookieParser());
  // Optionally add custom middleware (for example, to simulate authentication)
  middleware.forEach((mw) => app.use(mw));
  // Mount the usersRoutes under a base path
  app.use("/api/users", usersRoutes);
  return app;
};

describe("Users Routes", () => {
  let app;

  beforeEach(() => {
    // Create a fresh app instance for each test
    app = createTestApp();
  });

  describe("POST /api/users/register", () => {
    it("should call the registration controller and return 201", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password"
      };

      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toEqual({
        id: 1,
        username: userData.username,
        email: userData.email
      });
    });
  });

  describe("POST /api/users/login", () => {
    it("should call the login controller and return 200", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password"
      };

      const response = await request(app)
        .post("/api/users/login")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.user).toEqual({
        id: 1,
        username: "testUser",
        email: credentials.email
      });
    });
  });

  describe("GET /api/users/logout", () => {
    it("should call the logout controller and return 200", async () => {
      const response = await request(app).get("/api/users/logout");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });

  describe("GET /api/users/isUserAuth", () => {
    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app).get("/api/users/isUserAuth");
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User is not authenticated");
    });

    it("should return 200 if user is authenticated", async () => {
      // Create a test app that injects a user into the request
      const authMiddleware = (req, res, next) => {
        req.user = { id: 1, username: "authenticatedUser" };
        next();
      };
      const appWithUser = createTestApp([authMiddleware]);

      const response = await request(appWithUser).get("/api/users/isUserAuth");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User is authenticated");
      expect(response.body.user).toEqual({ id: 1, username: "authenticatedUser" });
    });
  });
});
