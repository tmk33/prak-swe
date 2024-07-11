class Kurs {
    static async getAll(pool) {
      const result = await pool.query(`SELECT 
            k.id AS kurs_id,
            k.name AS kurs_name,
            k.wochentag,
            k.startTime,
            k.endTime,
            m.name AS Dozent, -- Lấy tên Mitarbeiter
            r.name AS Raum,        -- Lấy tên Raum
            f.name AS Fachbereich   -- Lấy tên Fachbereich
        FROM 
            Kurs k
        JOIN 
            Mitarbeiter m ON k.mitarbeiter_id = m.id
        JOIN 
            Raum r ON k.raum_id = r.id
        JOIN
            Fachbereich f ON k.fachbereich_id = f.id;
        `);
      return result.rows;
    }

    static async getByFachbereich(pool, fachbereich_id) {
        const result = await pool.query(`SELECT 
            k.id AS kurs_id,
            k.name AS kurs_name,
            k.wochentag,
            k.startTime,
            k.endTime,
            m.name AS Dozent, -- Lấy tên Mitarbeiter
            r.name AS Raum,        -- Lấy tên Raum
            f.name AS Fachbereich   -- Lấy tên Fachbereich
        FROM 
            Kurs k
        JOIN 
            Mitarbeiter m ON k.mitarbeiter_id = m.id
        JOIN 
            Raum r ON k.raum_id = r.id
        JOIN
            Fachbereich f ON k.fachbereich_id = f.id
        WHERE k.fachbereich_id = $1;`, [fachbereich_id]);
        return result.rows;
    }

    static async getByMitarbeiterID(pool, mitarbeiter_id) {
        const result = await pool.query(`SELECT 
            k.id AS kurs_id,
            k.name AS kurs_name,
            k.wochentag,
            k.startTime,
            k.endTime,
            m.name AS mitarbeiter_name, 
            r.name AS raum_name,        
            f.name AS fachbereich_name   
        FROM 
            Kurs k
        JOIN 
            Mitarbeiter m ON k.mitarbeiter_id = m.id
        JOIN 
            Raum r ON k.raum_id = r.id
        JOIN
            Fachbereich f ON k.fachbereich_id = f.id
        WHERE k.mitarbeiter_id = $1;`, [mitarbeiter_id]);
        return result.rows;
    }

    static async getByMitarbeiterName(pool, mitarbeiterName) {
        const result = await pool.query(
            `
                        SELECT 
                k.id AS kurs_id,
                k.name AS kurs_name,
                k.wochentag,
                k.startTime,
                k.endTime,
                m.name AS mitarbeiter_name, 
                r.name AS raum_name,        
                f.name AS fachbereich_name   
            FROM 
                Kurs k
            JOIN 
                Mitarbeiter m ON k.mitarbeiter_id = m.id
            JOIN 
                Raum r ON k.raum_id = r.id
            JOIN
                Fachbereich f ON k.fachbereich_id = f.id

            WHERE m.name ILIKE $1;
            `,
            [`%${mitarbeiterName}%`] // Using ILIKE allows case-insensitive searching
          );
        return result.rows;
    }

  
  }
  
  module.exports = Kurs;