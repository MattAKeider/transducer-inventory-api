const express = require('express');
const { check } = require('express-validator');

const { 
  getTransducers, 
  getTransducerById, 
  createTransducer, 
  editTransducer, 
  deleteTransducer 
} = require('../controllers/transducer-controller');

const locations = ['CMC', 'MIDTOWN', 'RISMAN', 'CROCKER', 'STREETSBORO', 'BETTY THE BUS'];
const departments = ['MFM', 'L&D', 'IVF'];
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
    check('transducerType').not().isEmpty().isIn(types),
    check('serialNumber').not().isEmpty(),
    check('internalIdentifier').not().isEmpty(),
    check('controlNumber').not().isEmpty(),
    check('dateReceived').not().isEmpty(),
    check('outOfService').isBoolean(),
  ], 
  createTransducer
);

// PATCH edit an existing transducer
router.patch(
  '/:id', 
  [
    check('name').not().isEmpty(),
    check('location').not().isEmpty().isIn(locations),
    check('department').not().isEmpty().isIn(departments),
    check('room').not().isEmpty(),
    check('transducerType').not().isEmpty().isIn(types),
    check('serialNumber').not().isEmpty(),
    check('internalIdentifier').not().isEmpty(),
    check('controlNumber').not().isEmpty(),
    check('outOfService').isBoolean(),
  ], 
  editTransducer
);

// DELETE transducer by id
router.delete('/:id', deleteTransducer);

module.exports = router;