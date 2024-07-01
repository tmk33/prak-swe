const Mitarbeiter = require('../models/mitarbeiter');

exports.getAllMitarbeiter = (pool) => async (req, res) => {
  try {
    const mitarbeiter = await Mitarbeiter.getAll(pool);
    res.json(mitarbeiter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMitarbeiter = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
