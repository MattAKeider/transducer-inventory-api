const express = require('express');
const { check } = require('express-validator');

const {
  createCondition,
  getConditionsByTransducerId,
} = require('../controllers/condition-controller');
const checkAuth = require('../middleware/auth');

const conditions = [
  'New',
  'Working',
  'Refurbished',
  'Loaner',
  'Broken (Out of Service)',
];

const router = express.Router();

// GET get all condition objects for a given transducer id
router.get('/:id', getConditionsByTransducerId);

// check for auth token on next requests after above GET request
router.use(checkAuth);

// POST create a new condition object
router.post(
  '/',
  [
    check('condition').not().isEmpty().isIn(conditions),
    check('transducer').not().isEmpty(),
  ],
  createCondition
);

module.exports = router;
