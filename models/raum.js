class Raum {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM raum');
      return result.rows;
    }
  
    static async add(pool, raumData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Raum;