const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Transducer = require('../models/transducer');
const Condition = require('../models/condition');

const getTransducers = async (req, res, next) => {
  let transducers;

  try {
    transducers = await Transducer.find();
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  };

  res.status(200).json({ transducers: transducers.map(transducer => transducer.toObject({ getters: true })) });
};

const getTransducerById = async (req, res, next) => {
  const transducerId = req.params.id;

  let transducer;

  try {
    transducer = await Transducer.findById(transducerId);
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  };

  if (!transducer) {
    return next(new HttpError('Could not find a transducer with that id.', 404));
  }

  res.status(200).json({ transducer: transducer.toObject({ getters: true }) });
};

const createTransducer = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
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

  try {
   existingTransducer = await Transducer.findOne({ name, serialNumber });
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  };

  if (existingTransducer) {
    return next(new HttpError('Transducer already exists with given name or serial number', 409));
  }

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

  try {
    await newTransducer.save();
  } catch (error) {
    return next(new HttpError('Failed to write to database.', 500));
  };

  res.status(201).json({ transducer: newTransducer });
};

const editTransducer = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
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

  try {
    existingTransducer = await Transducer.findById(transducerId);
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  };

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

  try {
    await existingTransducer.save();
  } catch (error) {
    return next(new HttpError('Could not write to database', 500));
  };

  res.status(200).json({ transducer: existingTransducer });
};

const deleteTransducer = async (req, res, next) => {
  const transducerId = req.params.id;

  let transducer;

  try {
    transducer = await Transducer.findById(transducerId);
  } catch (error) {
    return next(new HttpError('Could not query database.', 500));
  };

  if (!transducer) {
    return next(new HttpError('Could not find a transducer with that id', 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await transducer.deleteOne({ session: session });
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