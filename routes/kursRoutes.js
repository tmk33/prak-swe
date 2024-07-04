const express = require('express');
const kursController = require('../controllers/kursController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', kursController.getAllKurs(pool));
  router.post('/', kursController.addKurs(pool));

  router.get('/fachbereich/:fachbereich_id', kursController.getKurseByFachbereich(pool));
  router.get('/dozentID/:mitarbeiter_id', kursController.getKurseByMitarbeiter(pool));
  //router.get('/dozentName/:mitarbeiter_id', kursController.getKurseByMitarbeiter(pool));



  return router;
};
