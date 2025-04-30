const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
    app: 'Express.js',
    version: '1.0.0',
  });
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
