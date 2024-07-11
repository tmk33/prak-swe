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
  }
  
  module.exports = Raum;