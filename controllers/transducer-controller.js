const { validationResult } = require('express-validator');

const { createNewTransducer } = require('../util/form-helpers');
const HttpError = require('../models/http-error');
const TRANSDUCERS = require('../data/dummy-data');

const getTransducers = (req, res, next) => {
  res.status(200).json({ transducers: TRANSDUCERS });
};

const getTransducerById = (req, res, next) => {
  const transducerId = req.params.id;
  const transducer = TRANSDUCERS.find(transducer => transducer.id === transducerId);

  if (!transducer) {
    throw new HttpError('Could not find a transducer with that id.', 404);
  }

  res.status(200).json({ transducer });
};

const createTransducer = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError('Invalid input values, please check your data', 422);
  }

  const data = req.body;
  const existing = TRANSDUCERS.find(transducer => {
    return transducer.name === data.name || transducer.serialNumber === data.serial;
  });

  if (existing) {
    throw new HttpError('Transducer already exists with given name or serial number', 409);
  }

  const newTransducer = createNewTransducer(data);

  TRANSDUCERS.unshift(newTransducer);

  res.status(201).json({ transducer: newTransducer });
};

module.exports = {
  getTransducers,
  getTransducerById,
  createTransducer,
};