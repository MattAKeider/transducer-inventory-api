const express = require('express');

const { getTransducers } = require('../controllers/transducers-controller');

const router = express.Router();

router.get('/', getTransducers);

module.exports = router;