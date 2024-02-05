const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const Condition = require('../models/condition');
const Transducer = require('../models/transducer');

const createCondition = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError('Invalid input values, please check your data', 422));
  }

  const { condition, notes, transducer } = req.body;

  const newCondition = new Condition({
    condition,
    note: notes,
    transducer
  });

  let existingTransducer;

  // Verify successful database operation
  try {
    existingTransducer = await Transducer.findById(transducer);
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  }

  // Verify transducer exists
  if (!existingTransducer) {
    return next(new HttpError('Could not find a transducer with given id', 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newCondition.save({ session: session });
    existingTransducer.currentCondition.unshift(newCondition);
    await existingTransducer.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not write to database', 500));
  };

  res.status(201).json({ condition: newCondition });
};

const getConditionsById = async (req, res, next) => {
  const transducerId = req.params.id;

  let conditions;

  // Verify successful database operation
  try {
    conditions = await Condition.find({ transducer: transducerId });
  } catch (error) {
    return next(new HttpError('Could not query from database', 500));
  };

  // Verify conditions exist for the given transducer
  if (!conditions || conditions.length === 0) {
    return next(new HttpError('Could not find condition logs with given transducer id', 404));
  }

  res.status(200).json({ conditions: conditions.map(condition => condition.toObject({ getters: true })) });
};

module.exports = {
  createCondition,
  getConditionsById,
};