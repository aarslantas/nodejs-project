const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes'); // Importing the tour routes
const userRouter = require('./routes/userRoutes'); // Importing the user routes

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev')); // Logging middleware for development
app.use(express.json()); // Middleware to parse JSON data from the request body

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next(); // Call the next middleware in the stack
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Add a request time property to the request object
  next(); // Call the next middleware in the stack
});

// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app; // Export the app for use in other modules (e.g., server.js)
