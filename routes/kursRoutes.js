const express = require('express');
const kursController = require('../controllers/kursController');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', kursController.getAllKurs(pool));
  router.post('/', kursController.addKurs(pool));

  return router;
};
