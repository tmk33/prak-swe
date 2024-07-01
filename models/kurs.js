class Kurs {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM kurs');
      return result.rows;
    }

    static async getByFachbereich(pool, fachbereich_id) {
        const result = await pool.query('SELECT * FROM kurs WHERE fachbereich_id = $1', [fachbereich_id]);
        return result.rows;
      }
  
    static async add(pool, kursData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Kurs;