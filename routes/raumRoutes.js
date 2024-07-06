const express = require('express');
const raumController = require('../controllers/raumController');
const authenticateAdmin = require('../middleware/auth');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', raumController.getAllRaum(pool));
  router.post('/', authenticateAdmin.authenticateAdmin, raumController.addRaum(pool));

  return router;
};

