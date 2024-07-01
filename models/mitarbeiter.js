class Mitarbeiter {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM mitarbeiter');
      return result.rows;
    }
  
    static async add(pool, mitarbeiterData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Mitarbeiter;