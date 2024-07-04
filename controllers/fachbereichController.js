const Fachbereich = require('../models/fachbereich');

exports.getAllFachbereich = (pool) => async (req, res) => {
  try {
    const fachbereich = await Fachbereich.getAll(pool);
    res.json(fachbereich);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFachbereich = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
