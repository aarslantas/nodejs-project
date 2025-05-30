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

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // Set the limit to 5 tours
  req.query.sort = '-ratingsAverage,price'; // Sort by ratings average and price in descending order
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // Select specific fields to return
  next(); // Call the next middleware in the stack
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Store the query object
    this.queryString = queryString; // Store the query string
  }

  filter() {
    // 1) FILTERING
    const queryObj = { ...this.queryString }; // Create a copy of the query string
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // Fields to exclude from filtering
    excludedFields.forEach((el) => delete queryObj[el]); // Remove excluded fields from the query object

    // 2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Replace comparison operators with MongoDB syntax
    this.query = this.query.find(JSON.parse(queryStr)); // Apply the filtering to the query
    return this; // Return the updated instance for method chaining
  }

  sort() {
    // 3) SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // Sort by specified fields
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sort by createdAt in descending order
    }
    return this; // Return the updated instance for method chaining
  }

  limitFields() {
    // 4) FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' '); // Select specified fields
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude the __v field by default
    }
    return this; // Return the updated instance for method chaining
  }

  paginate() {
    // 5) PAGINATION
    const page = this.queryString.page * 1 || 1; // Get the page number from the query or default to 1
    const limit = this.queryString.limit * 1 || 100; // Get the limit from the query or default to 100
    const skip = (page - 1) * limit; // Calculate the number of documents to skip for pagination

    this.query = this.query.skip(skip).limit(limit); // Skip the specified number of documents for pagination

    return this; // Return the updated instance for method chaining
  }
}

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

exports.getTour = async (req, res) => {
  try {
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

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); // Delete the tour by ID

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
