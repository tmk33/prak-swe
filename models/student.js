class Student {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM student');
      return result.rows;
    }
  
    static async add(pool, studentData) {
        const { name, email, geburtsdatum, fachbereich_id } = studentData;
        const result = await pool.query(
      'INSERT INTO student (name, email, geburtsdatum, fachbereich_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, geburtsdatum, fachbereich_id]
    );
        return result.rows[0];
    }

    static async delete(pool, id, name) {
        const result = await pool.query(
          'DELETE FROM student WHERE id = $1 AND name = $2 RETURNING *',
          [id, name]
        );
        return result.rows[0]; // Trả về thông tin sinh viên đã xóa (hoặc null nếu không tìm thấy)
    }

  }

  module.exports = Student;