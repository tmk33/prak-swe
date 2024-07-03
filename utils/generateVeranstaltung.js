const moment = require('moment');

module.exports = (pool) => {
    const getCurrentDateTime = async () => { 
        try {
            const result = await pool.query('SELECT NOW()'); // Truy vấn thời gian hiện tại
            return result.rows[0].now; // Trả về thời gian dưới dạng JavaScript Date object
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu:', err);
            return new Date(); // Trả về thời gian hiện tại của hệ thống nếu có lỗi
        }
    };

    const generateVeranstaltung = async (req, res) => { 
        const { name, fachbereichId } = req.body;

        async function timNgayItTietNhat(client, fachbereichId) {
            const result = await client.query(`
              SELECT 
                CASE WHEN mon <= tue AND mon <= wed AND mon <= thu AND mon <= fri THEN 'mon'
                     WHEN tue <= wed AND tue <= thu AND tue <= fri THEN 'tue'
                     WHEN wed <= thu AND wed <= fri THEN 'wed'
                     WHEN thu <= fri THEN 'thu'
                     ELSE 'fri' END AS ngay_it_tiet_nhat
              FROM Wochentagfachbereich
              WHERE fachbereich_id = $1
            `, [fachbereichId]);
          
            return result.rows[0].ngay_it_tiet_nhat;
        }
          
        async function timKhungGioPhuHop(client, fachbereichId, ngay) {
            const result = await client.query(`
              SELECT startTime, endTime
              FROM Kurs
              WHERE fachbereich_id = $1 AND wochentag = $2
            `, [fachbereichId, ngay]);
          
            const khungGioDaCo = result.rows;
            const blocks = [];
          
            // Khởi tạo mảng blocks với các block thời gian từ 8h đến 18h
            for (let i = 8; i < 18; i += 2) {
              blocks.push({ startTime: `${i}:00`, endTime: `${i + 2}:00`, available: true });
            }
          
            // Đánh dấu các block đã bị chiếm dụng
            for (const khungGio of khungGioDaCo) {
              const startBlockIndex = Math.floor(moment(khungGio.starttime, 'HH:mm').hour() / 2) - 4; // Chuyển đổi giờ bắt đầu thành chỉ số block
              const endBlockIndex = Math.floor(moment(khungGio.endtime, 'HH:mm').hour() / 2) - 4; // Chuyển đổi giờ kết thúc thành chỉ số block
          
              for (let i = startBlockIndex; i < endBlockIndex; i++) {
                blocks[i].available = false; // Đánh dấu block là không khả dụng
              }
            }
          
            // Lọc ra các block còn trống
            const khungGioPhuHop = blocks.filter(block => block.available);
          
            return khungGioPhuHop;
          }
          
          
          async function timGiangVienPhuHop(client, khungGioPhuHop, ngay) {
            let giangVienPhuHop = null;
            let minKursanzahl = 0;
            let maxKursanzahl = await client.query(`
              SELECT MAX(kursanzahl)
              FROM Mitarbeiter
              WHERE rolle = 'Dozent'
            `);
          
            maxKursanzahl = maxKursanzahl.rows[0].max; // Lấy giá trị maxKursanzahl
          
            while (!giangVienPhuHop && minKursanzahl <= maxKursanzahl+1) { // Thêm điều kiện kiểm tra maxKursanzahl
              const result = await client.query(`
                SELECT id, kursanzahl
                FROM Mitarbeiter
                WHERE rolle = 'Dozent' AND kursanzahl = $1
              `, [minKursanzahl]);
          
              for (const giangVien of result.rows) {
                const giangVienId = giangVien.id;
                const conflict = await client.query(`
                  SELECT 1
                  FROM Kurs
                  WHERE mitarbeiter_id = $1 AND wochentag = $4
                    AND (
                      (startTime <= $2 AND endTime > $2) OR
                      (startTime < $3 AND endTime >= $3) OR
                      (startTime >= $2 AND endTime <= $3)
                    )
                `, [giangVienId, khungGioPhuHop[0].startTime, khungGioPhuHop[0].endTime, ngay]);
          
                if (!conflict.rows.length) {
                  giangVienPhuHop = giangVien;
                  break; 
                }
              }
          
              minKursanzahl++; 
            }
          
            return giangVienPhuHop?.id;
          }
          
        async function timPhongTrong(client, khungGioPhuHop) {
            const result = await client.query(`
              SELECT id
              FROM Raum
              WHERE id NOT IN (
                SELECT raum_id
                FROM Kurs
                WHERE (
                  (startTime <= $1 AND endTime > $1) OR 
                  (startTime < $2 AND endTime >= $2) OR
                  (startTime >= $1 AND endTime <= $2)
                )
              )
              LIMIT 1
            `, [khungGioPhuHop.startTime, khungGioPhuHop.endTime]);
          
            return result.rows[0]?.id;
        }
          
        async function taoKhoaHocMoi(client, name, ngay, khungGio, giangVienId, phongId) {
            const result = await client.query(`
              INSERT INTO Kurs (name, wochentag, startTime, endTime, mitarbeiter_id, raum_id, fachbereich_id)
              VALUES ($1, $2, $3, $4, $5, $6, (SELECT fachbereich_id FROM Wochentagfachbereich WHERE $2 = CASE WHEN mon <= tue AND mon <= wed AND mon <= thu AND mon <= fri THEN 'mon'
                     WHEN tue <= wed AND tue <= thu AND tue <= fri THEN 'tue'
                     WHEN wed <= thu AND wed <= fri THEN 'wed'
                     WHEN thu <= fri THEN 'thu'
                     ELSE 'fri' END))
              RETURNING id
            `, [name, ngay, khungGio.startTime, khungGio.endTime, giangVienId, phongId]);
          
            return result.rows[0].id;
        }
          

        try {
            // 1. Tìm thứ trong tuần có k nhỏ nhất và lấy ngày đó ra

            // 2. tìm các veranstaltung có cùng fachbereich trong thứ đó và tìm ra giờ phù hợp

            // 3. tìm các Lehrperson có só k nhỏ nhất. đầu ra là 1 array Lehrperson

            // 4. duyệt từng phần tử trong array và so sánh xem giờ đã tìm ở bước 2 có phù hợp với Lehrperson đó không, nếu không thì tìm lehrperson tiếp theo

            // 5. nếu duyệt hết mà không tìm được Lehrperson phù hợp thì tìm Lehrperson có số k+1 tiếp theo

            // 6. nếu không tìm được Lehrperson phù hợp thì quay lại bước 2 tìm khung giờ phù hợp tiếp theo

            // 7. nếu duyệt hết các k mà không tìm được thì quay lại bước 1 tìm ngày tiếp theo k+1

            // 8. tìm phòng trống có thời gian đó

            const client = await pool.connect();

            // Bước 1: Tìm ngày có số tiết ít nhất
            const ngayItTietNhat = await timNgayItTietNhat(client, fachbereichId);

            // Bước 2: Tìm khung giờ phù hợp (2 tiếng)
            const khungGioPhuHop = await timKhungGioPhuHop(client, fachbereichId, ngayItTietNhat);

            // Bước 3: Tìm giảng viên phù hợp
            const giangVienPhuHop = await timGiangVienPhuHop(client, khungGioPhuHop, ngayItTietNhat);

            // Bước 4: Tìm phòng trống
            //const phongTrong = await timPhongTrong(client, khungGioPhuHop);

            // Bước 5: Tạo khóa học mới
            //const newKursId = await taoKhoaHocMoi(client, name, ngayItTietNhat, khungGioPhuHop, giangVienPhuHop, phongTrong);

            await client.release();

            res.json({ message: 'Tạo khóa học mới thành công!', wochentag: ngayItTietNhat, khungGio: khungGioPhuHop, giangVien: giangVienPhuHop });
                    
        } catch (err) {
            console.error('Lỗi:', err);
            return new Date(); // Trả về thời gian hiện tại của hệ thống nếu có lỗi
        }
    };

    return {
        getCurrentDateTime,
        generateVeranstaltung
    };
};