const express = require('express');
const { check } = require('express-validator');

const { getTransducers, getTransducerById, createTransducer } = require('../controllers/transducer-controller');

const locations = ['CMC', 'MIDTOWN', 'RISMAN', 'CROCKER', 'STREETSBORO', 'BETTY THE BUS'];
const departments = ['MFM', 'L&D', 'IVF'];
const conditions = ['New', 'Working', 'Refurbished', 'Loaner', 'Broken (Out of Service)'];
const types = ['TV', 'TA'];

const router = express.Router();

// GET all transducers
router.get('/', getTransducers);

// GET transducer by id
router.get('/:id', getTransducerById);

// POST create a new transducer
router.post(
  '/', 
  [
    check('name').not().isEmpty(),
    check('location').not().isEmpty().isIn(locations),
    check('department').not().isEmpty().isIn(departments),
    check('room').not().isEmpty(),
    check('type').not().isEmpty().isIn(types),
    check('serial').not().isEmpty(),
    check('internal').not().isEmpty(),
    check('control').not().isEmpty(),
    check('received').not().isEmpty(),
    check('service').isBoolean(),
    check('condition').not().isEmpty().isIn(conditions),
  ], 
  createTransducer
);

module.exports = router;