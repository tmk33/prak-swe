class Raum {
    static async getAll(pool) {
      const result = await pool.query('SELECT * FROM raum');
      return result.rows;
    }
  
    static async add(pool, raumData) {
      const { name, ort } = raumData;
        const result = await pool.query(
      'INSERT INTO raum (name, ort) VALUES ($1, $2) RETURNING *',
      [name, ort]
    );
        return result.rows[0];
    }

    static async getById(pool, id) {
      const result = await pool.query('SELECT * FROM raum WHERE id = $1', [id]);
      return result.rows[0]; 
    }

    static async deleteById(pool, id) {
      const query = 'DELETE FROM raum WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result;
    }
  }
  
  module.exports = Raum;