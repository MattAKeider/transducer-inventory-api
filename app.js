require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const transducerRoutes = require('./routes/transducer-routes');
const conditionRoutes = require('./routes/condition-routes');

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  next();
});

app.use(express.json());
app.use('/api/transducers', transducerRoutes);
app.use('/api/conditions', conditionRoutes);

// Handle all unknown routes
app.use((req, res, next) => {
  return next(new HttpError('Unknown route, check request path url.', 400));
});

// Default "catch-all" error handler middleware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error has occured.' });
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });