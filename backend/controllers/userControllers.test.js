// controllers/userController.test.js

const { registration, login, userAuth, logout } = require('./userController');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../models', () => ({
  User: {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  },
}));

// Helper function to create a mock response object
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // allows chaining like res.status(...).json(...)
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registration', () => {
    it('should return 400 if user already exists', async () => {
      const req = { body: { username: 'testUser', email: 'test@example.com', password: 'password' } };
      const res = mockRes();
      // Simulate that the user already exists
      User.findUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await registration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User with this email already exists',
      });
    });

    it('should register a new user and return token', async () => {
      const req = { body: { username: 'testUser', email: 'test@example.com', password: 'password' } };
      const res = mockRes();

      // Simulate that the user does not exist
      User.findUserByEmail.mockResolvedValue(null);
      // Simulate creating a new user
      User.createUser.mockResolvedValue({ id: 2, username: 'testUser', email: 'test@example.com' });
      // Mock bcrypt.hash to return a fixed hashed password
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      // Mock jwt.sign to return a fake token
      jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken');

      await registration(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(res.cookie).toHaveBeenCalledWith('token', 'fakeToken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        token: 'fakeToken',
        user: {
          id: 2,
          username: 'testUser',
          email: 'test@example.com',
        },
      });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      const req = { body: { email: 'notfound@example.com', password: 'password' } };
      const res = mockRes();

      // Simulate that the user is not found
      User.findUserByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should return 401 if password does not match', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
      const res = mockRes();

      // Simulate that a user is found with a stored hashed password
      User.findUserByEmail.mockResolvedValue({
        id: 3,
        username: 'testUser',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      // Mock bcrypt.compare to return false indicating the password doesn't match
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const req = { body: { email: 'test@example.com', password: 'correctpassword' } };
      const res = mockRes();

      // Simulate a user found with a matching password
      User.findUserByEmail.mockResolvedValue({
        id: 4,
        username: 'testUser',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      // Mock bcrypt.compare to return true indicating the password matches
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      // Mock jwt.sign to return a fake token for a successful login
      jest.spyOn(jwt, 'sign').mockReturnValue('fakeLoginToken');

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 4 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(res.cookie).toHaveBeenCalledWith('token', 'fakeLoginToken', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        token: 'fakeLoginToken',
        user: {
          id: 4,
          username: 'testUser',
          email: 'test@example.com',
        },
      });
    });
  });

  describe('userAuth', () => {
    it('should return 200 if user is authenticated', () => {
      const req = { user: { id: 5, username: 'authUser' } };
      const res = mockRes();

      userAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User is authenticated',
        user: req.user,
      });
    });

    it('should return 401 if user is not authenticated', () => {
      const req = {};
      const res = mockRes();

      userAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User is not authenticated',
      });
    });
  });

  describe('logout', () => {
    it('should clear the token cookie and return 200', () => {
      const req = {};
      const res = mockRes();

      logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});
