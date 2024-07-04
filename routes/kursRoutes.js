const express = require('express');
const kursController = require('../controllers/kursController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', kursController.getAllKurs(pool));
  router.post('/', kursController.addKurs(pool));

  router.get('/fachbereich/:fachbereich_id', kursController.getKurseByFachbereich(pool));
  router.get('/dozent/id/:mitarbeiter_id', kursController.getKurseByMitarbeiterID(pool));
  router.get('/dozent/name/:mitarbeiterName', kursController.getKurseByMitarbeiterName(pool));



  return router;
};
