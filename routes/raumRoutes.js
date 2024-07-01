const express = require('express');
const raumController = require('../controllers/raumController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', raumController.getAllRaum(pool));
  router.post('/', raumController.addRaum(pool));

  return router;
};
