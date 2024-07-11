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

  exports.deleteKursByID = (pool) => async (req, res) => {
    const kursId = req.params.id;

    try {
      // 1. Get Kurs information
      const kursResult = await pool.query('SELECT mitarbeiter_id, fachbereich_id, wochentag FROM Kurs WHERE id = $1', [kursId]);
      const kurs = kursResult.rows[0];
      if (!kurs) {
        return res.status(404).json({ error: 'No Kurs found' });
      }

      // 2. Delete Kurs
      await pool.query('DELETE FROM Kurs WHERE id = $1', [kursId]);

      // 3. reduce the number of Kursanzahl in Mitarbeiter
      await pool.query('UPDATE Mitarbeiter SET kursanzahl = kursanzahl - 1 WHERE id = $1', [kurs.mitarbeiter_id]);

      // 4. reduce the number of Kursanzahl in Wochentagfachbereich
      const wochentagColumn = kurs.wochentag; // 'mon', 'tue', etc.
      await pool.query(`UPDATE Wochentagfachbereich SET ${wochentagColumn} = ${wochentagColumn} - 1 WHERE fachbereich_id = $1`, [kurs.fachbereich_id]);

      res.json({ message: "Kurs ID " + kursId + " has been removed" });
    } catch (err) {
      console.error('Error deleting Kurs:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };


