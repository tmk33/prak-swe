class Fachbereich {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM fachbereich');
      return result.rows;
    }
  
    static async add(pool, fachbereichData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Fachbereich;