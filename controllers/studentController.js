const Student = require('../models/student');

exports.getAllStudents = (pool) => async (req, res) => {
  try {
    const students = await Student.getAll(pool);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStudent = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
