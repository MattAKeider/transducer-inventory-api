const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { signupUser } = require('../../controllers/user-controller');
const User = require('../../models/user');

jest.mock('express-validator');
jest.mock('bcryptjs');
jest.mock('../../models/user.js');

const userDocument = {
  _id: '665f55f4b5fbae54da8f881a',
  username: 'tester',
  email: 'tester@test.com',
  password: 'dummy_hash',
  __v: 0,
};

const req = {
  body: {
    username: 'tester',
    email: 'tester@test.com',
    password: 'password41!',
  },
};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('signupUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(true),
    }));
  });

  test('should throw an error if invalid request body inputs given', async () => {
    jest.mocked(expressValidator.validationResult).mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(false),
    }));

    await signupUser(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Invalid input values, please check your data')
    );
  });

  test('should fail to query database for existing user', async () => {
    jest.mocked(User.findOne).mockRejectedValueOnce();

    await signupUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not query database.'));
  });

  test('should throw an error if user already exists', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(userDocument);
    await signupUser(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('User already exists, please login')
    );
  });

  test('should fail to create user if failed to create hashed password', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(null);
    jest.mocked(bcrypt.hash).mockRejectedValueOnce();
    await signupUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not create user'));
  });

  test('should fail to write to the database if user not created successfully', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(null);
    jest.mocked(bcrypt.hash).mockResolvedValueOnce('dummy_hash');

    jest.mocked(User.prototype.save).mockRejectedValueOnce();

    await signupUser(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Failed to write to database.')
    );
  });

  test('should fail to create token', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(null);
    jest.mocked(bcrypt.hash).mockResolvedValueOnce('dummy_hash');

    await signupUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not create token'));
  });

  test('should create user', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(null);
    jest.mocked(bcrypt.hash).mockResolvedValueOnce('dummy_hash');
    jest.spyOn(jwt, 'sign').mockReturnValue('dummy_token');

    await signupUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
