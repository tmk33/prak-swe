const express = require('express');
const raumController = require('../controllers/sonderveranstaltungController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', raumController.getAllSonderveranstaltung(pool));
  router.post('/', raumController.addSonderveranstaltung(pool));

  return router;
};
