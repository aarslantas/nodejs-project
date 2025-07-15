const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // Set the limit to 5 tours
  req.query.sort = '-ratingsAverage,price'; // Sort by ratings average and price in descending order
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // Select specific fields to return
  next(); // Call the next middleware in the stack
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Create an instance of APIFeatures and apply filtering, sorting, field limiting, and pagination

    const tours = await features.query; // Fetch all tours from the database

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

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
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
});

exports.deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // Match tours with average rating >= 4.5
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // Group by difficulty level
        numTours: { $sum: 1 }, // Count the number of tours
        numRatings: { $sum: '$ratingsQuantity' }, // Sum the ratings quantity
        avgRating: { $avg: '$ratingsAverage' }, // Calculate average rating
        avgPrice: { $avg: '$price' }, // Calculate average price
        minPrice: { $min: '$price' }, // Find minimum price
        maxPrice: { $max: '$price' }, // Find maximum price
      },
    },
    {
      $sort: { avgPrice: 1 }, // Sort by average price in ascending order
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1; // Convert year from string to number

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // Unwind the startDates array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), // Match start dates greater than or equal to January 1st of the given year
          $lte: new Date(`${year}-12-31`), // Match start dates less than or equal to December 31st of the given year
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // Group by month
        numToursStarts: { $sum: 1 }, // Count the number of tours starting in each month
        tours: { $push: '$name' }, // Collect tour names in an array
      },
    },
    {
      $addFields: { month: '$_id' }, // Add a field for the month
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the output
      },
    },
    {
      $sort: { numToursStarts: -1 }, // Sort by number of tours starting in descending order
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
