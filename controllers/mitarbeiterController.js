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
  try {
    const { name, email, geburtsdatum, rolle } = req.body; // Lấy dữ liệu từ body request
    const newMitarbeiter = await Mitarbeiter.add(pool, { name, email, geburtsdatum, rolle });
    res.status(201).json(newMitarbeiter); // Trả về thông tin sinh viên mới với mã 201 Created
} catch (err) {
    res.status(500).json({ error: err.message });
}
};
