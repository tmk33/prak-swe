class Kurs {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM kurs');
      return result.rows;
    }

    static async getByFachbereich(pool, fachbereich_id) {
        const result = await pool.query('SELECT * FROM kurs WHERE fachbereich_id = $1', [fachbereich_id]);
        return result.rows;
    }

    static async getByMitarbeiterID(pool, mitarbeiter_id) {
        const result = await pool.query('SELECT * FROM kurs WHERE mitarbeiter_id = $1', [mitarbeiter_id]);
        return result.rows;
    }

    static async getByMitarbeiterName(pool, mitarbeiterName) {
        const result = await pool.query(
            `
            SELECT k.* 
            FROM Kurs k 
            JOIN Mitarbeiter m ON k.mitarbeiter_id = m.id
            WHERE m.name ILIKE $1
            `,
            [`%${mitarbeiterName}%`] // Sử dụng ILIKE cho phép tìm kiếm không phân biệt chữ hoa/thường
          );
        return result.rows;
    }
  
    static async add(pool, kursData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Kurs;