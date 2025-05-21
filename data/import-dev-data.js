const fs = require('fs'); // Import file system module for file operations
const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling
const dotenv = require('dotenv'); // Import dotenv for environment variable management
// Import the Express app from app.js

const Tour = require('../models/tourModel');

dotenv.config({ path: './config.env' }); // Load environment variables from config.env
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
); // Replace <PASSWORD> in the database URL with the actual password

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!')) // Log success message on successful connection
  .catch((err) => console.error('DB connection error:', err));

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'); // Read the tours data from JSON file

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours)); // Parse the JSON data and create tours in the database
    console.log('Data successfully loaded!'); // Log success message
    // Exit the process
  } catch (err) {
    console.error(err); // Log any errors that occur
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany(); // Delete all tours from the database
    console.log('Data successfully deleted!'); // Log success message
    // Exit the process
  } catch (err) {
    console.error(err); // Log any errors that occur
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData(); // Import data if --import flag is provided
}
if (process.argv[2] === '--delete') {
  deleteData(); // Delete data if --delete flag is provided
}

console.log(process.argv); // Log the command line arguments
