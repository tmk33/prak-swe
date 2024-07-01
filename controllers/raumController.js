const Raum = require('../models/raum');

exports.getAllRaum = (pool) => async (req, res) => {
  try {
    const raum = await Raum.getAll(pool);
    res.json(raum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRaum = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
