class Sonderveranstaltung {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM sonderveranstaltung');
      return result.rows;
    }
  
    static async add(pool, sonderveranstaltungData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Sonderveranstaltung;