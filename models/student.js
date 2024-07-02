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

    static async update(pool, id, studentData) {
        const updates = [];
        const values = [];
    
        // Xây dựng mảng updates và values dựa trên các trường có giá trị mới
        if (studentData.name) {
          updates.push('name = $' + (updates.length + 1));
          values.push(studentData.name);
        }
        if (studentData.email) {
          updates.push('email = $' + (updates.length + 1));
          values.push(studentData.email);
        }
        if (studentData.geburtsdatum) {
          updates.push('geburtsdatum = $' + (updates.length + 1));
          values.push(studentData.geburtsdatum);
        }
        if (studentData.fachbereich_id) {
          updates.push('fachbereich_id = $' + (updates.length + 1));
          values.push(studentData.fachbereich_id);
        }
    
        // Nếu không có trường nào được cập nhật, trả về null
        if (updates.length === 0) {
          return null;
        }
    
        values.push(id); // Thêm id vào cuối mảng values
    
        const query = `UPDATE student SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`;
    
        const result = await pool.query(query, values);
    
        return result.rows[0];
      }

  }

  module.exports = Student;