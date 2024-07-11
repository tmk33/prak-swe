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
