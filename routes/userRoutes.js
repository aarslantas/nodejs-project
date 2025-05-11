const express = require('express');

const router = express.Router();
const { getAllUser } = require('../controllers/userController.js');

// const {
//   getAllUser,
//   getUser,
//   createUser,
//   updateUser,
//   deleteUser,
// } = require('../controllers/userController.js');

// router.route('/').get(getAllUser).post(createUser);
router.route('/').get(getAllUser);
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
