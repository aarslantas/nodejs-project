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

module.exports = APIFeatures; // Export the APIFeatures class for use in other modules
