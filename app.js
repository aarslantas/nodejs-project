const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes'); // Importing the tour routes
const userRouter = require('./routes/userRoutes'); // Importing the user routes

const app = express();

// 1) MIDDLEWARES

console.log(process.env.NODE_ENV); // Log the current environment (development or production)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use morgan for logging in development mode
}

app.use(express.json()); // Middleware to parse JSON data from the request body
// app.use(express.static(`${__dirname}/public`)); // Serve static files from the public directory

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Add a request time property to the request object
  next(); // Call the next middleware in the stack
});

// 2) ROUTE HANDLERS

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app; // Export the app for use in other modules (e.g., server.js)
