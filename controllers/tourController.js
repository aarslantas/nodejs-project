const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`, 'utf-8')
);


exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`); // Log the tour ID to the console
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next(); // Call the next middleware in the stack
}


exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next(); // Call the next middleware in the stack
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime); // Log the query parameters to the console
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; // Convert string to number
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1; // Convert string to number
  const tour = tours.find((el) => el.id === id);


  // Update the tour object with the new data from the request body
  Object.assign(tour, req.body);

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1; // Convert string to number
  const tourIndex = tours.findIndex((el) => el.id === id);


  tours.splice(tourIndex, 1); // Remove the tour from the array

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};
