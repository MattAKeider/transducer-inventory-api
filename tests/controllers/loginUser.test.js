const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { loginUser } = require('../../controllers/user-controller');
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
    email: 'tester@test.com',
    password: 'password41!',
  },
};

const res = {
  status: jest.fn((x) => x).mockReturnThis(),
  json: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

describe('loginUser', () => {
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

    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('Invalid input values, please check your data')
    );
  });

  test('should fail to query database for existing user', async () => {
    jest.mocked(User.findOne).mockRejectedValueOnce();

    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not query database.'));
  });

  test('should throw an error if user does not exist', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(null);
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new Error('User does not exist, please sign up.')
    );
  });

  test('should throw an error if password does not match', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(userDocument);
    jest.mocked(bcrypt.compare).mockRejectedValueOnce();
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not log the user in.'));
  });

  test('should throw an error if credentials are incorrect', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(userDocument);
    jest.mocked(bcrypt.compare).mockResolvedValueOnce(false);
    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Invalid credentials'));
  });

  test('should fail to create token', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(userDocument);
    jest.mocked(bcrypt.compare).mockResolvedValueOnce(true);

    await loginUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error('Could not create token'));
  });

  test('should login user', async () => {
    jest.mocked(User.findOne).mockResolvedValueOnce(userDocument);
    jest.mocked(bcrypt.compare).mockResolvedValueOnce(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('dummy_token');

    await loginUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
