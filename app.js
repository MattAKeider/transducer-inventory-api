const express = require('express');

const HttpError = require('./models/http-error');
const transducerRoutes = require('./routes/transducer-routes');

const app = express();

app.use(express.json());
app.use('/api/transducers', transducerRoutes);

// Handle all unknown routes
app.use((req, res, next) => {
  throw new HttpError('Unknown route, check request path url.', 400);
});

// Default "catch-all" error handler middleware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error has occured.' });
});

app.listen(5000);