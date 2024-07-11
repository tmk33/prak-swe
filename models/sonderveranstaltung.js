// models/sonderveranstaltung.js

const e = require('express');
const moment = require('moment');

class Sonderveranstaltung {
  // ... (Các phương thức khác)
  static async getAll(pool) {
    const result = await pool.query('SELECT * FROM sonderveranstaltung');
    return result.rows;
  }

  static async add(pool, sonderveranstaltungData) {
    const { name, date, wochentag, beschreibung, dauertStunden } = sonderveranstaltungData;

    try {
        // Step 1: find Sonderveranstaltung on the same day
        const existingEvents = await pool.query(`
            SELECT *
            FROM Sonderveranstaltung
            WHERE DATE(startTime) = to_date($1, 'DD.MM.YYYY');
          `, [date]); 


        const availableTimeSlot = await this.findAvailableTimeSlot(existingEvents.rows, dauertStunden);

        // Step 2: Find a suitable Dozent
        const suitableDozent = await this.findSuitableDozent(pool, wochentag, availableTimeSlot);

        // Step 3: Find an empty Raum
        const availableRaum = await this.findAvailableRaum(pool, wochentag, availableTimeSlot);

        // If a suitable Dozent or Raum cannot be found, report an error
        if (!suitableDozent || !availableRaum) {
          return {Information: 'No suitable Dozent or Raum found'};
        }

        const formattedDate = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD'); // format change
        const startTimeStamp = moment(`${formattedDate} ${availableTimeSlot.starttime}`, 'YYYY-MM-DD HH:mm:ss').format();
        const endTimeStamp = moment(`${formattedDate} ${availableTimeSlot.endtime}`, 'YYYY-MM-DD HH:mm:ss').format();


        // create new Sonderveranstaltung
        const result = await pool.query(
            'INSERT INTO sonderveranstaltung (name, starttime, endtime, beschreibung, mitarbeiter_id, raum_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, startTimeStamp, endTimeStamp, beschreibung, suitableDozent.id, availableRaum.id]
        );

        // Increase the Dozent's sonderkursanzahl
        await pool.query(
            'UPDATE Mitarbeiter SET sonderkursanzahl = sonderkursanzahl + 1 WHERE id = $1',
            [suitableDozent.id]
        );

        return result.rows[0];

      } catch (error) {
        console.error(error); 
        throw error; 
      }
  }

 
  static async findAvailableTimeSlot(existingEvents, dauertStunden) {
    const maxEndTime = moment('18:00:00', 'HH:mm:ss'); 

    if (existingEvents.length === 0) {
      // If there is no Sonderveranstaltung yet, start at 8 o'clock
      return { 
        starttime: moment('08:00:00', 'HH:mm:ss').format('HH:mm:ss'), 
        endtime: moment('08:00:00', 'HH:mm:ss').add(dauertStunden, 'hours').format('HH:mm:ss') 
      };
    } else {
      // Sort existing Sonderveranstaltung by starttime
      existingEvents.sort((a, b) => a.starttime - b.starttime);

      // Get the endtime of the last Sonderveranstaltung
      const lastEventEndTime = moment(existingEvents[existingEvents.length - 1].endtime, 'HH:mm:ss');

      // Check if there is enough time after the last Sonderveranstaltung
      const potentialEndTime = lastEventEndTime.clone().add(dauertStunden, 'hours');
      if (potentialEndTime.format('HH:mm:ss') <= maxEndTime.format('HH:mm:ss')) {
        return { 
          starttime: lastEventEndTime.format('HH:mm:ss'), 
          endtime: potentialEndTime.format('HH:mm:ss') 
        };
      } else {
        // Not enough time, returns null
        return null;
      }
    }
  }

  static async findSuitableDozent(pool, wochentag, availableTimeSlot) {
    try {
      const { starttime, endtime } = availableTimeSlot; 

      const query = `
        SELECT m.*
        FROM Mitarbeiter m
        WHERE m.rolle = 'Dozent'
          AND NOT EXISTS (
            SELECT 1
            FROM Kurs k
            WHERE k.mitarbeiter_id = m.id
              AND k.wochentag = $1
              AND (
                (k.startTime <= $2 AND k.endTime > $2) OR  -- Sự kiện mới bắt đầu trong khung giờ của khóa học
                (k.startTime < $3 AND k.endTime >= $3)    -- Sự kiện mới kết thúc trong khung giờ của khóa học
              )
          )
        ORDER BY (m.kursanzahl * 2 + m.sonderkursanzahl) ASC
        LIMIT 1;
      `;

      const result = await pool.query(query, [wochentag, starttime, endtime]);
      return result.rows[0] || null; // Returns the first Dozent found or null
    } catch (err) {
      throw err;
    }
  }
  
  static async findAvailableRaum(pool, wochentag, availableTimeSlot) {
    try {
      const { starttime, endtime } = availableTimeSlot; 

      const query = `
        SELECT r.*
        FROM Raum r
        WHERE NOT EXISTS (
          SELECT 1
          FROM Kurs k
          WHERE k.raum_id = r.id
            AND k.wochentag = $1
            AND (
              (k.startTime <= $2 AND k.endTime > $2) OR  -- Sự kiện mới bắt đầu trong khung giờ của khóa học
              (k.startTime < $3 AND k.endTime >= $3)    -- Sự kiện mới kết thúc trong khung giờ của khóa học
            )
        )
        LIMIT 1;
      `;

      const result = await pool.query(query, [wochentag, starttime, endtime]);
      return result.rows[0] || null; // Returns the first Raum found or null
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Sonderveranstaltung;