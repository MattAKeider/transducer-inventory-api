const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // skip OPTIONS request when checking token
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // retrieve the token originally created during login or signup from client request headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authentication failed!');
    }

    // verify token with secret key or will throw error
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };

    // if no errors, then pass userData object to request
    next();
  } catch (error) {
    return next(new HttpError('Authentication failed!', 401));
  }
};