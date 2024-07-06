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
    try {
      // Kiểm tra định dạng ngày tháng
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
      if (!dateRegex.test(req.body.date)) {
        return res.status(400).json({ error: 'Định dạng ngày tháng không hợp lệ' });
      }
  
      const newSonderveranstaltungId = await Sonderveranstaltung.add(pool, req.body);
      res.json({ message: 'Thêm Sonderveranstaltung thành công!', id: newSonderveranstaltungId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
