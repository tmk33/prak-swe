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
      // Check the date format
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
      if (!dateRegex.test(req.body.date)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
  
      const newSonderveranstaltungId = await Sonderveranstaltung.add(pool, req.body);
      res.json({ message: 'new Sonderveranstaltung added successfully!', id: newSonderveranstaltungId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }


};

exports.addStudent = (pool) => async (req, res) => {
    const { student_id, sonderveranstaltung_id } = req.body;

    try {
        // Check if student_id and sonderveranstaltung_id are valid
        if (!student_id || !sonderveranstaltung_id) {
        return res.status(400).json({ error: 'Missing student_id or sonderveranstaltung_id' });
        }

        // Add a record to the Student_Sonderveranstaltung table
        const result = await pool.query(
        'INSERT INTO Student_Sonderveranstaltung (student_id, sonderveranstaltung_id) VALUES ($1, $2) RETURNING *',
        [student_id, sonderveranstaltung_id]
        );

        res.status(201).json(result.rows[0]); // Returns the newly created record
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the student to the event' });
    }

};

exports.getStudentBySonderveranstaltung = (pool) => async (req, res) => {
    const sonderveranstaltungId = req.params.id;

  try {
    const query = `
      SELECT s.name, s.email
      FROM Student s
      JOIN Student_Sonderveranstaltung ss ON s.id = ss.student_id
      WHERE ss.sonderveranstaltung_id = $1
    `;

    const result = await pool.query(query, [sonderveranstaltungId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No students found for this event' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching students' });
  }
};

exports.deleteSonderveranstaltung = (pool) => async (req, res) => {
    const sonderveranstaltungId = req.params.id;

  try {
    await pool.query('BEGIN');

    // Get the instructor information before deleting
    const getDozentQuery = `
      SELECT mitarbeiter_id
      FROM sonderveranstaltung
      WHERE id = $1
    `;
    const dozentResult = await pool.query(getDozentQuery, [sonderveranstaltungId]);

    if (dozentResult.rows.length === 0) {
      await pool.query('ROLLBACK'); 
      return res.status(404).json({ message: 'Sonderveranstaltung not found' });
    }

    const mitarbeiterId = dozentResult.rows[0].mitarbeiter_id;

    // Delete related records in Student_Sonderveranstaltung
    await pool.query('DELETE FROM Student_Sonderveranstaltung WHERE sonderveranstaltung_id = $1', [sonderveranstaltungId]);

    // Delete Sonderveranstaltung
    await pool.query('DELETE FROM sonderveranstaltung WHERE id = $1', [sonderveranstaltungId]);

    // Reduce the number of Sonderkursanzahl in Mitarbeiter
    await pool.query('UPDATE Mitarbeiter SET sonderkursanzahl = sonderkursanzahl - 1 WHERE id = $1', [mitarbeiterId]);

    await pool.query('COMMIT'); 

    res.status(200).json({ message: 'Sonderveranstaltung deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK'); 
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the Sonderveranstaltung' });
  }
};
