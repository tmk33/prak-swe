const express = require('express');
const raumController = require('../controllers/raumController');
const authenticateAdmin = require('../middleware/auth');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', raumController.getAllRaum(pool));
  router.get('/:id', raumController.getRaumById(pool)); 

  router.post('/', authenticateAdmin.authenticateAdmin, raumController.addRaum(pool));
  router.delete('/:id', authenticateAdmin.authenticateAdmin, raumController.deleteRaumById(pool));

  return router;
};

