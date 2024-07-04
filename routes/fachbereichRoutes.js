const express = require('express');
const fachbereichController = require('../controllers/fachbereichController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', fachbereichController.getAllFachbereich(pool));
  router.post('/', fachbereichController.addFachbereich(pool));

  return router;
};
