const express = require('express');
const { check } = require('express-validator');

const { createCondition, getConditionsById } = require('../controllers/condition-controller');

const conditions = ['New', 'Working', 'Refurbished', 'Loaner', 'Broken (Out of Service)'];

const router = express.Router();

// POST create a new condition object
router.post(
  '/', 
  [
    check('condition').not().isEmpty().isIn(conditions),
    check('transducer').not().isEmpty(),
  ],
  createCondition
);

// GET get all condition objects for a given transducer id
router.get('/:id', getConditionsById);

module.exports = router;