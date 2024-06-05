const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const secretKey = process.env.JWT_KEY;

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input values, please check your data', 422)
    );
  }

  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  }

  if (existingUser) {
    return next(new HttpError('User already exists, please login', 409));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Could not create user', 500));
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError('Failed to write to database.', 500));
  }

  const payload = {
    userId: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };

  let token;

  try {
    // create JavaScript web token to use in client on success
    token = jwt.sign(payload, secretKey, { expiresIn: '3hr' });
  } catch (error) {
    return next(new HttpError('Could not create token', 500));
  }

  res.status(201).json({ ...payload, token });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input values, please check your data', 422)
    );
  }

  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  }

  if (!user) {
    return next(new HttpError('User does not exist, please sign up.', 404));
  }

  let isValidPassword = false;

  try {
    // compare entered password with existing user's hashed password
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(new HttpError('Could not log the user in.', 500));
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials', 401));
  }

  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

  let token;

  try {
    // create JavaScript web token to use in client on success
    token = jwt.sign(payload, secretKey, { expiresIn: '3hr' });
  } catch (error) {
    return next(new HttpError('Could not create token', 500));
  }

  res.status(200).json({ ...payload, token });
};

module.exports = {
  signupUser,
  loginUser,
};
