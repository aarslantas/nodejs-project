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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});
const PORT = process.env.PORT || 3000; // Set the port to the value from environment variables or default to 3000
app.listen(PORT, () => {
  console.log('server is running on port 3000');
});
