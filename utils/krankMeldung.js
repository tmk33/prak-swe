const moment = require('moment');

module.exports = (pool) => {

    const krankMeldung = async (req, res) => { 
        const { mitarbeiterId, ngay, date } = req.body;

            // Hàm tìm giảng viên thay thế
        async function timGiangVienThayThe(client, kurs, ngay) {
            const khungGioPhuHop = { startTime: kurs.starttime, endTime: kurs.endtime };
            const giangVienThayTheId = await timGiangVienPhuHop(client, khungGioPhuHop, ngay, kurs.fachbereich_id);
            return giangVienThayTheId;
        }

        // Hàm hủy khóa học và thông báo sinh viên
        async function huyKhoaHocVaThongBaoSinhVien(client, fachbereichId, kursId) {
            // Lấy danh sách sinh viên đã đăng ký khóa học
            const { rows: sinhVienRows } = await client.query(
                'SELECT id, name, email FROM student WHERE fachbereich_id = $1',
                [fachbereichId]
            );

            // Gửi thông báo đến từng sinh viên (triển khai theo cách bạn muốn)
            for (const sinhVien of sinhVienRows) {
                // ... (Gửi email, thông báo trong ứng dụng, ...)
                console.log("Thong bao cho sinh vien " + sinhVien.email + " Kurs " + kursId + " bi huy!");
            }
        }

        async function timGiangVienPhuHop(client, khungGioPhuHop, ngay) {
            let giangVienPhuHop = null;
            let minKursanzahl = 0;
          
            // Lấy số lượng khóa học tối đa của tất cả giảng viên
            const maxKursanzahlResult = await client.query(`
              SELECT MAX(kursanzahl) 
              FROM Mitarbeiter 
              WHERE rolle = 'Dozent'
            `);
          
            const maxKursanzahl = maxKursanzahlResult.rows[0].max || 0; // Nếu không có giảng viên nào, maxKursanzahl = 0


            while (!giangVienPhuHop && minKursanzahl <= maxKursanzahl) {
              const giangVienResult = await client.query(`
                SELECT id, kursanzahl, email
                FROM Mitarbeiter
                WHERE rolle = 'Dozent' AND kursanzahl = $1
              `, [minKursanzahl]);
          
              for (const giangVien of giangVienResult.rows) {
                const giangVienId = giangVien.id;
                const conflictResult = await client.query(`
                  SELECT 1
                  FROM Kurs
                  WHERE mitarbeiter_id = $1 AND wochentag = $2
                    AND (
                      (startTime <= $3 AND endTime > $3) OR
                      (startTime < $4 AND endTime >= $4) OR
                      (startTime >= $3 AND endTime <= $4)
                    )
                `, [giangVien.id, ngay, khungGioPhuHop.startTime, khungGioPhuHop.endTime]);
          
                if (!conflictResult.rows.length) {
                  giangVienPhuHop = giangVien;
                  break;
                }
              }
          
              minKursanzahl++; // Tăng minKursanzahl để tìm giảng viên có số khóa học nhiều hơn
            }
            

            return giangVienPhuHop ? { giangVienId: giangVienPhuHop.id, khungGio: khungGioPhuHop, ngay, email: giangVienPhuHop.email} : null;
          }
          
          
          

        try {
            const client = await pool.connect();
            await client.query('BEGIN'); // Bắt đầu transaction

            const ketQuaXuLy = [];
            // Kiểm tra kursanzahl của giảng viên
            const { rows: mitarbeiterRows } = await client.query(
            'SELECT kursanzahl FROM Mitarbeiter WHERE id = $1',
            [mitarbeiterId]
            );
            if (mitarbeiterRows.length === 0 || mitarbeiterRows[0].kursanzahl === 0) {
            await client.query('COMMIT'); // Không có khóa học nào để xử lý
            return res.json({ message: 'Giảng viên không có khóa học nào cả.' });
            }

            // Tìm các khóa học của giảng viên trong ngày đã cho
            const { rows: kurseRows } = await client.query(
            'SELECT * FROM Kurs WHERE mitarbeiter_id = $1 AND wochentag = $2',
            [mitarbeiterId, ngay]
            );

            
            // Tìm giảng viên thay thế và xử lý các khóa học
            for (const kurs of kurseRows) {
                const giangVienThayThe = await timGiangVienThayThe(client, kurs, ngay);

                if (giangVienThayThe) {
                    // Cập nhật khóa học với giảng viên thay thế
                    // thông báo cho giảng viên mới biết
                    ketQuaXuLy.push({ date: date, kursId: kurs.id, status: 'thayTheGiangVien', giangVienMoi: giangVienThayThe.giangVienId }); // Lưu kết quả
                    console.log("Thong bao cho Dozent: " + giangVienThayThe.email + "dam nhiem Kurs " + kurs.id );
                } else {
                    // Không tìm thấy giảng viên thay thế, hủy khóa học và thông báo cho sinh viên
                    await huyKhoaHocVaThongBaoSinhVien(client, kurs.fachbereich_id, kurs.id);
                    ketQuaXuLy.push({ date: date, kursId: kurs.id, status: 'huyKurs' }); // Lưu kết quả

                }
            }

            await client.query('COMMIT');
            res.json({ message: 'Xu Ly Thanh Cong!', ketQua: ketQuaXuLy }); // Trả về mảng kết quả

        } catch (err) {
            console.error('Lỗi:', err);
            return new Date(); // Trả về thời gian hiện tại của hệ thống nếu có lỗi
        }
    };

    return {
        
        krankMeldung
    };
};