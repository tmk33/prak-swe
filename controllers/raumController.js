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
  try {
    const { name, ort } = req.body; // Lấy dữ liệu từ body request
    const newRaum = await Raum.add(pool, { name, ort });
    res.status(201).json(newRaum); // Trả về thông tin sinh viên mới với mã 201 Created
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};
