class Student {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM student');
      return result.rows;
    }
  
    static async add(pool, studentData) {
      // Thêm logic để chèn dữ liệu studentData vào bảng students
    }
  }
  
  module.exports = Student;