class Student {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM student');
      return result.rows;
    }
  
    static async add(pool, studentData) {
        const { name, email, geburtsdatum, fachbereich_id, semester } = studentData;
        const result = await pool.query(
      'INSERT INTO student (name, email, geburtsdatum, fachbereich_id, semester) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, geburtsdatum, fachbereich_id, semester]
    );
        return result.rows[0];
    }

    static async delete(pool, id, name) {
        const result = await pool.query(
          'DELETE FROM student WHERE id = $1 AND name = $2 RETURNING *',
          [id, name]
        );
        return result.rows[0]; // Returns deleted student information (or null if not found)
    }

    static async update(pool, id, studentData) {
        const updates = [];
        const values = [];
    
        // Build the updates and values ​​array based on the fields with new values
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
        if (studentData.semester) {
          updates.push('semester = $' + (updates.length + 1));
          values.push(studentData.semester);
        }
    
        // If no fields are updated, null is returned
        if (updates.length === 0) {
          return null;
        }
    
        values.push(id); // Add id to the end of the values ​​array
    
        const query = `UPDATE student SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`;
    
        const result = await pool.query(query, values);
    
        return result.rows[0];
      }

  }

  module.exports = Student;