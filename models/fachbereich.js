class Fachbereich {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM fachbereich');
      return result.rows;
    }
  
    static async add(pool, fachbereichData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
      const { name } = fachbereichData;
      const result = await pool.query(
    'INSERT INTO fachbereich (name) VALUES ($1) RETURNING *',
    [name]
  );

    await pool.query(
        `INSERT INTO Wochentagfachbereich (fachbereich_id, mon, tue, wed, thu, fri)
        VALUES ($1, 0, 0, 0, 0, 0)`,
        [result.rows[0].id]
    );
      return result.rows[0];

    }
  }
  
  module.exports = Fachbereich;