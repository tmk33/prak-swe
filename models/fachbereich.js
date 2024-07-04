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
      return result.rows[0];

    }
  }
  
  module.exports = Fachbereich;