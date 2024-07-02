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
    try {
        const { name, email, geburtsdatum, fachbereich_id } = req.body; // Lấy dữ liệu từ body request
        const newStudent = await Student.add(pool, { name, email, geburtsdatum, fachbereich_id });
        res.status(201).json(newStudent); // Trả về thông tin sinh viên mới với mã 201 Created
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteStudent = (pool) => async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const name = req.params.name;

        const deletedStudent = await Student.delete(pool, id, name); // Gọi hàm delete trong model

        if (deletedStudent) {
            res.json({ message: 'Student deleted!' });
        } else {
            res.status(404).json({ error: 'error: Student not found!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStudent = (pool) => async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email, geburtsdatum, fachbereich_id } = req.body;

        const updatedStudent = await Student.update(pool, id, { name, email, geburtsdatum, fachbereich_id });

        if (updatedStudent) {
            res.json(updatedStudent);
        } else {
            res.status(404).json({ error: 'Không tìm thấy sinh viên' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
