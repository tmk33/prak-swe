const express = require('express');
const fachbereichController = require('../controllers/fachbereichController');
const authenticateAdmin = require('../middleware/auth');


module.exports = (pool) => {
  const router = express.Router();

  router.get('/', fachbereichController.getAllFachbereich(pool));
  router.get('/:id', fachbereichController.getFachbereichById(pool)); 
  router.post('/', authenticateAdmin.authenticateAdmin, fachbereichController.addFachbereich(pool));

  return router;
};
