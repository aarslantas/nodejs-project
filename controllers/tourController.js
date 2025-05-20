const Tour = require('../models/tourModel'); // Import the Tour model

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../data/tours-simple.json`, 'utf-8'),
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`); // Log the tour ID to the console
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next(); // Call the next middleware in the stack
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find(); // Fetch all tours from the database
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log(`Tour id is: ${req.params.id}`); // Log the tour ID to the console
    // Convert string to number
    const tour = await Tour.findById(req.params.id); // Find the tour by ID

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// exports.deleteTour = (req, res) => {
//   const id = req.params.id * 1; // Convert string to number
//   const tourIndex = tours.findIndex((el) => el.id === id);

//   tours.splice(tourIndex, 1); // Remove the tour from the array

//   fs.writeFile(
//     `${__dirname}/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(204).json({
//         status: 'success',
//         data: null,
//       });
//     },
//   );
// };
