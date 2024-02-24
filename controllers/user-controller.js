const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const HttpError = require("../models/http-error");
const User = require('../models/user');

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
  }

  const { username, email, password } = req.body;

  let existingUser;
  
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  }

  if(existingUser) {
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
  };

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
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

  res.status(200).json({ message: 'Logged In!', user: user.toObject({ getters: true })});
};

module.exports = {
  signupUser,
  loginUser,
};