const Sonderveranstaltung = require('../models/sonderveranstaltung');

exports.getAllSonderveranstaltung = (pool) => async (req, res) => {
  try {
    const sonderveranstaltung = await Sonderveranstaltung.getAll(pool);
    res.json(sonderveranstaltung);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSonderveranstaltung = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
