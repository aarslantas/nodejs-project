const app = require('./app'); // Import the Express app from app.js
const dotenv = require('dotenv'); // Import dotenv for environment variable management

dotenv.config({ path: './config.env' }); // Load environment variables from config.env

console.log(app.get('env'));
const PORT = process.env.PORT || 3000; // Set the port to the value from environment variables or default to 3000
app.listen(PORT, () => {
  console.log('server is running on port 3000');
});
