const express = require('express');
const mitarbeiterController = require('../controllers/mitarbeiterController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', mitarbeiterController.getAllMitarbeiter(pool));
  router.post('/', mitarbeiterController.addMitarbeiter(pool));

  return router;
};
