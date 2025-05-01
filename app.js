const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); // Middleware to parse JSON data from the request body

// app.get('/', (req, res) => {
//   res.status(404).json({
//     message: 'Hello World!',
//     app: 'Express.js',
//     version: '1.0.0',
//   });
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
