const express = require('express');
const studentController = require('../controllers/studentController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', studentController.getAllStudents(pool));
  router.post('/', studentController.addStudent(pool));

  return router;
};
