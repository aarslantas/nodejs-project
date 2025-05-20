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

// Log the current environment (development or production)

const PORT = process.env.PORT || 3000; // Set the port to the value from environment variables or default to 3000
console.log('PORT NO', PORT);
app.listen(PORT, () => {
  console.log('server is running on port 3000');
});
