const express = require('express');
const raumController = require('../controllers/sonderveranstaltungController');
const authenticateAdmin = require('../middleware/auth');


module.exports = (pool) => {
  const router = express.Router();

  router.get('/', raumController.getAllSonderveranstaltung(pool));
  router.post('/', authenticateAdmin.authenticateAdmin, raumController.addSonderveranstaltung(pool));

  return router;
};
