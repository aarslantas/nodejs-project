const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/users-simple.json`, 'utf-8')
);

exports.getAllUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      tours,
    },
  });
};
