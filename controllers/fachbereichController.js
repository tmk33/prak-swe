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
  try {
    const { name } = req.body; 
    const newFachbereich = await Fachbereich.add(pool, { name });
    res.status(201).json(newFachbereich); 
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

exports.getFachbereichById = (pool) => async (req, res) => {
  const fachbereichId = req.params.id; 

  try {
    const fachbereich = await Fachbereich.getById(pool, fachbereichId);
    
    if (!fachbereich) { 
      return res.status(404).json({ error: 'Fachbereich not found' });
    }

    res.json(fachbereich);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

