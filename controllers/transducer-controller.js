const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Transducer = require('../models/transducer');
const Condition = require('../models/condition');

// Get all transducers
const getTransducers = async (req, res, next) => {
  let transducers;

  // Query database for all transducer db documents
  try {
    transducers = await Transducer.find();
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  };

  // Intentionally, an empty array and returned results will return a 200.
  res.status(200).json({ transducers: transducers.map(transducer => transducer.toObject({ getters: true })) });
};

// Get transducer by transducer id
const getTransducerById = async (req, res, next) => {
  const transducerId = req.params.id;

  let transducer;

  /*
  Query database for specific transducer by transducer id. 
  Will throw a 500 if id given is not 12 or 24 byte, i.e., not valid id.
  */
  try {
    transducer = await Transducer.findById(transducerId);
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  };

  // if null returned then return 404
  if (!transducer) {
    return next(new HttpError('Could not find a transducer with that id.', 404));
  }

  res.status(200).json({ transducer: transducer.toObject({ getters: true }) });
};

// Create a new transducer 
const createTransducer = async (req, res, next) => {
  // extract validation errors if wrong inputs
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
  }

  const { 
    name, 
    location, 
    department, 
    transducerType, 
    room,
    serialNumber,
    internalIdentifier,
    controlNumber,
    dateReceived,
    outOfService
  } = req.body;

  let existingTransducer;

  // Query database for transducer db document with same name or serial#
  try {
    existingTransducer = await Transducer.findOne({ name, serialNumber });
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  };

  // If transducer with either same name or serial# exists then throw error
  if (existingTransducer) {
    return next(new HttpError('Transducer already exists with given name or serial number', 409));
  }

  // Create new transducer db document 
  const newTransducer = new Transducer({
    name,
    location,
    department,
    transducerType,
    room,
    serialNumber,
    internalIdentifier,
    controlNumber,
    dateReceived: new Date(dateReceived),
    outOfService,
    currentCondition: []
  });

  // Save new transducer db document to database
  try {
    await newTransducer.save();
  } catch (error) {
    return next(new HttpError('Failed to write to database.', 500));
  };

  res.status(201).json({ transducer: newTransducer.toObject({ getters: true }) });
};

// Update an existing transducer
const editTransducer = async (req, res, next) => {
  // extract validation errors if wrong inputs
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
  }
  
  const transducerId = req.params.id;
  const { 
    name, 
    location, 
    department, 
    transducerType, 
    room,
    serialNumber,
    internalIdentifier,
    controlNumber,
    outOfService
  } = req.body;

  let existingTransducer;

  // Query for existing transducer db document by id
  try {
    existingTransducer = await Transducer.findById(transducerId);
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  };

  // If null returned then throw error for non-existing transducer
  if (!existingTransducer) {
    return next(new HttpError('Could not find a transducer with that id.', 404));
  }

  // Update values in existing transducer
  existingTransducer.name = name;
  existingTransducer.location = location;
  existingTransducer.department = department,
  existingTransducer.transducerType = transducerType;
  existingTransducer.room = room;
  existingTransducer.serialNumber = serialNumber;
  existingTransducer.internalIdentifier = internalIdentifier;
  existingTransducer.controlNumber = controlNumber;
  existingTransducer.outOfService = outOfService;

  // Save updated transducer db document to database
  try {
    await existingTransducer.save();
  } catch (error) {
    return next(new HttpError('Could not write to database', 500));
  };

  res.status(200).json({ transducer: existingTransducer });
};

// Delete a transducer plus all condition logs associated
const deleteTransducer = async (req, res, next) => {
  const transducerId = req.params.id;

  let transducer;

  // Query for existing transducer db document by id
  try {
    transducer = await Transducer.findById(transducerId);
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  };

  // If null returned then throw error for non-existing transducer
  if (!transducer) {
    return next(new HttpError('Could not find a transducer with that id', 404));
  }

  /*
  Use a session and start a transaction to fail, and throw error, on any
  related operation failure. Either on delete transducer or deleting all related 
  conditions.
  */
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await transducer.deleteOne({ session });
    await Condition.deleteMany({ transducer: transducerId }).session(session);
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not write to database.', 500));
  };

  res.status(200).json({ message: 'Deleted!' });
};

module.exports = {
  getTransducers,
  getTransducerById,
  createTransducer,
  editTransducer,
  deleteTransducer,
};