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
  try {
    const { name, email, geburtsdatum, rolle } = req.body; 
    const newMitarbeiter = await Mitarbeiter.add(pool, { name, email, geburtsdatum, rolle });
    res.status(201).json(newMitarbeiter); 
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

exports.getMitarbeiterById = (pool) => async (req, res) => {
  const mitarbeiterId = req.params.id; 

  try {
    const mitarbeiter = await Mitarbeiter.getById(pool, mitarbeiterId);
    
    if (!mitarbeiter) { // Xử lý trường hợp không tìm thấy
      return res.status(404).json({ error: 'Mitarbeiter not found' });
    }

    res.json(mitarbeiter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
