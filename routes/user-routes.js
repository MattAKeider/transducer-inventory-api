const express = require('express');
const { check } = require('express-validator');

const { signupUser, loginUser } = require('../controllers/user-controller');

const router = express.Router();

router.post(
  '/signup',
  [
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isStrongPassword({
      minLength: 6,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ],
  signupUser
);

router.post(
  '/login',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty(),
  ],
  loginUser
);

module.exports = router;
