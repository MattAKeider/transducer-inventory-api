const { validationResult } = require('express-validator');

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
    return next(new HttpError('User already exists.', 409));
  }

  const newUser = new User({
    username,
    email,
    password,
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

  if (!user || user.password !== password) {
    return next(new HttpError('Not authorized, please check credentials.', 401));
  }

  res.status(200).json({ message: 'Logged In!'});
};

module.exports = {
  signupUser,
  loginUser,
};