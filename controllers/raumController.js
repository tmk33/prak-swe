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
  try {
    const { name, ort } = req.body; 
    const newRaum = await Raum.add(pool, { name, ort });
    res.status(201).json(newRaum); 
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
};

exports.getRaumById = (pool) => async (req, res) => {
  const raumId = req.params.id; 

  try {
    const raum = await Raum.getById(pool, raumId);
    
    if (!raum) { 
      return res.status(404).json({ error: 'Raum not found' });
    }

    res.json(raum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
