const express = require('express');
const studentController = require('../controllers/studentController');
const authenticateAdmin = require('../middleware/auth');


module.exports = (pool) => {
		const router = express.Router();

		router.get('/', studentController.getAllStudents(pool));
		router.post('/', authenticateAdmin.authenticateAdmin, studentController.addStudent(pool));
        router.put('/:id', authenticateAdmin.authenticateAdmin, studentController.updateStudent(pool));
        router.delete('/:id/:name', authenticateAdmin.authenticateAdmin, studentController.deleteStudent(pool));

		return router;
};
