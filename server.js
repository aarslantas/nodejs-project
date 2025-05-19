const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling
const dotenv = require('dotenv'); // Import dotenv for environment variable management
const app = require('./app'); // Import the Express app from app.js

dotenv.config({ path: './config.env' }); // Load environment variables from config.env
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
); // Replace <PASSWORD> in the database URL with the actual password

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!')) // Log success message on successful connection
  .catch((err) => console.error('DB connection error:', err));

// Create a Tour model based on the schema

const testTour = new Tour({
  name: 'The Park Camper 4',
  price: 997,
  rating: 4.7,
});

testTour
  .save()
  .then(() => console.log('Tour saved successfully!')) // Log success message on successful save
  .catch((err) => console.error('Error saving tour:', err)); // Log error message on failure

const PORT = process.env.PORT || 3000; // Set the port to the value from environment variables or default to 3000
app.listen(PORT, () => {
  console.log('server is running on port 3000');
});
