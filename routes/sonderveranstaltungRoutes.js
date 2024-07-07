const express = require('express');
const sonderveranstaltungController = require('../controllers/sonderveranstaltungController');
const authenticateAdmin = require('../middleware/auth');


module.exports = (pool) => {
  const router = express.Router();

  router.get('/', sonderveranstaltungController.getAllSonderveranstaltung(pool));
  router.get('/student/:id', sonderveranstaltungController.getStudentBySonderveranstaltung(pool));
  router.post('/', authenticateAdmin.authenticateAdmin, sonderveranstaltungController.addSonderveranstaltung(pool));
  router.post('/add/student', authenticateAdmin.authenticateAdmin, sonderveranstaltungController.addStudent(pool));
  router.delete('/:id/', authenticateAdmin.authenticateAdmin, sonderveranstaltungController.deleteSonderveranstaltung(pool));


  return router;
};
