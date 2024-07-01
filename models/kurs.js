class Kurs {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM kurs');
      return result.rows;
    }
  
    static async add(pool, kursData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Kurs;