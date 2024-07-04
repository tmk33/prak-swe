class Mitarbeiter {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM mitarbeiter');
      return result.rows;
    }
  
    static async add(pool, mitarbeiterData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
      const { name, email, geburtsdatum, rolle } = mitarbeiterData;
      const result = await pool.query(
    'INSERT INTO mitarbeiter (name, email, geburtsdatum, rolle) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, geburtsdatum, rolle]
  );
      return result.rows[0];
    }
  }
  
  module.exports = Mitarbeiter;