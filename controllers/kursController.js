const Kurs = require('../models/kurs');

exports.getAllKurs = (pool) => async (req, res) => {
  try {
    const kurs = await Kurs.getAll(pool);
    res.json(kurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addKurs = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
