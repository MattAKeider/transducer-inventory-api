const TRANSDUCERS = require('../data/dummy-data');

const getTransducers = (req, res, next) => {
  res.status(200).json({ transducers: TRANSDUCERS });
};

module.exports = {
  getTransducers,
};