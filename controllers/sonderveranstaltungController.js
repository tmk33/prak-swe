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

exports.addStudent = (pool) => async (req, res) => {
    const { student_id, sonderveranstaltung_id } = req.body;

    try {
        // Kiểm tra xem student_id và sonderveranstaltung_id có hợp lệ hay không
        if (!student_id || !sonderveranstaltung_id) {
        return res.status(400).json({ error: 'Missing student_id or sonderveranstaltung_id' });
        }

        // Thêm bản ghi vào bảng Student_Sonderveranstaltung
        const result = await pool.query(
        'INSERT INTO Student_Sonderveranstaltung (student_id, sonderveranstaltung_id) VALUES ($1, $2) RETURNING *',
        [student_id, sonderveranstaltung_id]
        );

        res.status(201).json(result.rows[0]); // Trả về bản ghi mới được tạo
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
    // Bắt đầu một transaction để đảm bảo tính toàn vẹn dữ liệu
    await pool.query('BEGIN');

    // Lấy thông tin giảng viên của sự kiện trước khi xóa
    const getDozentQuery = `
      SELECT mitarbeiter_id
      FROM sonderveranstaltung
      WHERE id = $1
    `;
    const dozentResult = await pool.query(getDozentQuery, [sonderveranstaltungId]);

    if (dozentResult.rows.length === 0) {
      await pool.query('ROLLBACK'); // Hoàn tác transaction nếu không tìm thấy sự kiện
      return res.status(404).json({ message: 'Sonderveranstaltung not found' });
    }

    const mitarbeiterId = dozentResult.rows[0].mitarbeiter_id;

    // Xóa các bản ghi liên quan trong Student_Sonderveranstaltung
    await pool.query('DELETE FROM Student_Sonderveranstaltung WHERE sonderveranstaltung_id = $1', [sonderveranstaltungId]);

    // Xóa Sonderveranstaltung
    await pool.query('DELETE FROM sonderveranstaltung WHERE id = $1', [sonderveranstaltungId]);

    // Giảm sonderkursanzahl của giảng viên
    await pool.query('UPDATE Mitarbeiter SET sonderkursanzahl = sonderkursanzahl - 1 WHERE id = $1', [mitarbeiterId]);

    await pool.query('COMMIT'); // Kết thúc transaction thành công

    res.status(200).json({ message: 'Sonderveranstaltung deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK'); // Hoàn tác transaction nếu có lỗi
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the Sonderveranstaltung' });
  }
};
