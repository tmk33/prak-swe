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
  try {
    const { name } = req.body; // Lấy dữ liệu từ body request
    const newFachbereich = await Fachbereich.add(pool, { name });
    res.status(201).json(newFachbereich); // Trả về thông tin sinh viên mới với mã 201 Created
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};
