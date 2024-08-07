class Mitarbeiter {
    static async getAll(pool) {
      const result = await pool.query('SELECT id, name, email, geburtsdatum, rolle, kursanzahl, sonderkursanzahl FROM mitarbeiter');
      return result.rows;
    }
  
    static async add(pool, mitarbeiterData) {
      const { name, email, geburtsdatum, rolle } = mitarbeiterData;
      const result = await pool.query(
    'INSERT INTO mitarbeiter (name, email, geburtsdatum, rolle) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, geburtsdatum, rolle]
  );
      return result.rows[0];
    }

    static async getById(pool, id) {
      const result = await pool.query('SELECT id, name, email, geburtsdatum, rolle, kursanzahl, sonderkursanzahl FROM mitarbeiter WHERE id = $1', [id]);
      return result.rows[0]; 
    }
  }
  
  module.exports = Mitarbeiter;