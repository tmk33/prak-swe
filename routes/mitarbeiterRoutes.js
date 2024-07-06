const express = require('express');
const mitarbeiterController = require('../controllers/mitarbeiterController');
const authenticateAdmin = require('../middleware/auth');


module.exports = (pool) => {
  const router = express.Router();

  router.get('/', mitarbeiterController.getAllMitarbeiter(pool));
  router.post('/', authenticateAdmin.authenticateAdmin, mitarbeiterController.addMitarbeiter(pool));

  return router;
};
