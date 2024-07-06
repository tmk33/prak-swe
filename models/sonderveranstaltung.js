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
        // Bước 1: tìm các sự kiện cùng ngày
        const existingEvents = await pool.query(`
            SELECT *
            FROM Sonderveranstaltung
            WHERE DATE(startTime) = to_date($1, 'DD.MM.YYYY');
          `, [date]); 


        const availableTimeSlot = await this.findAvailableTimeSlot(existingEvents.rows, dauertStunden);

        // Bước 2: Tìm giảng viên phù hợp
        const suitableDozent = await this.findSuitableDozent(pool, wochentag, availableTimeSlot);

        // Bước 3: Tìm phòng học trống
        const availableRaum = await this.findAvailableRaum(pool, wochentag, availableTimeSlot);

        // Nếu không tìm thấy giảng viên hoặc phòng học phù hợp, báo lỗi
        if (!suitableDozent || !availableRaum) {
          return {Information: 'No suitable Dozent or Raum found'};
        }

        const formattedDate = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD'); // Chuyển đổi date sang định dạng YYYY-MM-DD
        const startTimeStamp = moment(`${formattedDate} ${availableTimeSlot.starttime}`, 'YYYY-MM-DD HH:mm:ss').format();
        const endTimeStamp = moment(`${formattedDate} ${availableTimeSlot.endtime}`, 'YYYY-MM-DD HH:mm:ss').format();


        // Tạo sự kiện mới
        const result = await pool.query(
            'INSERT INTO sonderveranstaltung (name, starttime, endtime, beschreibung, mitarbeiter_id, raum_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, startTimeStamp, endTimeStamp, beschreibung, suitableDozent.id, availableRaum.id]
        );

        return result.rows[0];

      } catch (error) {
        console.error(error); // In ra thông tin lỗi
        throw error; 
      }
  }

  // Hàm tìm ngày có ít tiết Sonderveranstaltung nhất
  static async findAvailableTimeSlot(existingEvents, dauertStunden) {
    const maxEndTime = moment('18:00:00', 'HH:mm:ss'); // Giờ kết thúc tối đa là 18h

    if (existingEvents.length === 0) {
      // Nếu chưa có sự kiện nào, bắt đầu lúc 8 giờ
      return { 
        starttime: moment('08:00:00', 'HH:mm:ss').format('HH:mm:ss'), 
        endtime: moment('08:00:00', 'HH:mm:ss').add(dauertStunden, 'hours').format('HH:mm:ss') 
      };
    } else {
      // Sắp xếp các sự kiện hiện có theo thời gian bắt đầu
      existingEvents.sort((a, b) => a.starttime - b.starttime);

      // Lấy thời gian kết thúc của sự kiện cuối cùng
      const lastEventEndTime = moment(existingEvents[existingEvents.length - 1].endtime, 'HH:mm:ss');

      // Kiểm tra xem có đủ thời gian sau sự kiện cuối cùng không
      const potentialEndTime = lastEventEndTime.clone().add(dauertStunden, 'hours');
      if (potentialEndTime.format('HH:mm:ss') <= maxEndTime.format('HH:mm:ss')) {
        return { 
          starttime: lastEventEndTime.format('HH:mm:ss'), 
          endtime: potentialEndTime.format('HH:mm:ss') 
        };
      } else {
        // Không đủ thời gian, trả về null
        return null;
      }
    }
  }
  // Hàm tìm giảng viên phù hợp (đơn giản hóa)
  static async findSuitableDozent(pool, wochentag, availableTimeSlot) {
    try {
      const { starttime, endtime } = availableTimeSlot; // Lấy thời gian bắt đầu và kết thúc

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
      return result.rows[0] || null; // Trả về giảng viên đầu tiên tìm thấy hoặc null
    } catch (err) {
      throw err;
    }
  }
  
  // Hàm tìm phòng học trống
  // Hàm tìm phòng học trống (đơn giản hóa)
  static async findAvailableRaum(pool, wochentag, availableTimeSlot) {
    try {
      const { starttime, endtime } = availableTimeSlot; // Lấy thời gian bắt đầu và kết thúc

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
      return result.rows[0] || null; // Trả về phòng học đầu tiên tìm thấy hoặc null
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Sonderveranstaltung;