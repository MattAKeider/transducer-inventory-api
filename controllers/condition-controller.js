const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Condition = require('../models/condition');
const Transducer = require('../models/transducer');

// Create a new condition log entry
const createCondition = async (req, res, next) => {
  // Extract validation errors if wrong inputs
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input values, please check your data', 422)
    );
  }

  const { condition, note, transducer } = req.body;

  let existingTransducer;

  // Query database for existing transducer related to new condition
  try {
    existingTransducer = await Transducer.findById(transducer);
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  }

  // If null returned then throw error for non-existing transducer
  if (!existingTransducer) {
    return next(
      new HttpError('Could not find a transducer with given id', 404)
    );
  }

  // Create new condition db document
  const newCondition = new Condition({
    condition,
    note,
    transducer,
  });

  /*
  Use a session and start a transaction to fail, and throw error, on any
  related operation failure. Either on save transducer or related added
  condition.
  */
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newCondition.save({ session });
    existingTransducer.currentCondition.unshift(newCondition);
    await existingTransducer.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not write to database', 500));
  }

  res.status(201).json({ condition: newCondition });
};

// Get all associated transducer conditions by transducer id
const getConditionsByTransducerId = async (req, res, next) => {
  const transducerId = req.params.id;

  let conditions;

  // Query database for all related condition db documents
  try {
    conditions = await Condition.find({ transducer: transducerId });
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  }

  /*
  A newly created transducer document will always contain a condition log entry. 
  If query returns null or has empty array then throw an error with 404 status.
  */
  if (!conditions || conditions.length === 0) {
    return next(
      new HttpError(
        'Could not find condition logs for given transducer id',
        404
      )
    );
  }

  res
    .status(200)
    .json({
      conditions: conditions.map((condition) =>
        condition.toObject({ getters: true })
      ),
    });
};

module.exports = {
  createCondition,
  getConditionsByTransducerId,
};
