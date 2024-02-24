const HttpError = require("../models/http-error");

const DUMMY_USERS = [];

const signupUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
  }

  const { username, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if(hasUser) {
    return next(new HttpError('User already exists.', 422));
  }

  const newUser = {
    id: crypto.randomUUID(),
    username,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};

const loginUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
  }

  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError('User does not exist, please check credentials.', 401));
  }

  res.status(200).json({ message: 'Logged In!'});
};

module.exports = {
  signupUser,
  loginUser,
};