const Kurs = require('../models/kurs');

exports.getAllKurs = (pool) => async (req, res) => {
  try {
    const kurs = await Kurs.getAll(pool);
    res.json(kurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKurseByFachbereich = (pool) => async (req, res) => {
    try {
      const fachbereich_id = parseInt(req.params.fachbereich_id);
      const kurse = await Kurs.getByFachbereich(pool, fachbereich_id);
      res.json(kurse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.getKurseByMitarbeiterID = (pool) => async (req, res) => {
    try {
      const mitarbeiter_id = parseInt(req.params.mitarbeiter_id);
      const kurse = await Kurs.getByMitarbeiterID(pool, mitarbeiter_id);
      res.json(kurse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.getKurseByMitarbeiterName = (pool) => async (req, res) => {
    try {
      const mitarbeiterName = req.params.mitarbeiterName;
      const kurse = await Kurs.getByMitarbeiterName(pool, mitarbeiterName);
      res.json(kurse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.addKurs = (pool) => async (req, res) => {
  // ... (Thêm logic xử lý cho việc thêm sinh viên)
};
