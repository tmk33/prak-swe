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
              SELECT mon, tue, wed, thu, fri
              FROM Wochentagfachbereich
              WHERE fachbereich_id = $1
            `, [fachbereichId]);
          
            const { mon, tue, wed, thu, fri } = result.rows[0];
            const ngay = [
              { name: 'mon', value: mon },
              { name: 'tue', value: tue },
              { name: 'wed', value: wed },
              { name: 'thu', value: thu },
              { name: 'fri', value: fri }
            ];
          
            // Sắp xếp mảng ngày theo số tiết tăng dần
            ngay.sort((a, b) => a.value - b.value);
          
            return ngay; // Trả về toàn bộ mảng ngày đã sắp xếp
          }
          
        async function timCacKhungGioPhuHop(client, fachbereichId, ngay) {
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
          
        async function timGiangVienVaKhungGioPhuHop(client, khungGioPhuHop, ngay) {
            let giangVienPhuHop = null;
            let minKursanzahl = 0;
            let maxKursanzahl = await client.query(`
                SELECT MAX(kursanzahl)
                FROM Mitarbeiter
                WHERE rolle = 'Dozent'
            `);
        
            maxKursanzahl = maxKursanzahl.rows[0].max; // Lấy giá trị maxKursanzahl
            let khungGioIndex = 0; // Khởi tạo chỉ số khung giờ
            let khungGio = khungGioPhuHop[khungGioIndex]; // Lấy khung giờ đầu tiên
        
            while (!giangVienPhuHop && minKursanzahl <= maxKursanzahl + 1 && khungGioIndex < khungGioPhuHop.length) { 
                // Duyệt qua các khung giờ
                khungGio = khungGioPhuHop[khungGioIndex];
                
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
                    `, [giangVienId, khungGio.startTime, khungGio.endTime, ngay]); // Sử dụng khungGio hiện tại
        
                    if (!conflict.rows.length) {
                        giangVienPhuHop = giangVien;
                        break;
                    }
                }
        
                if (!giangVienPhuHop) {
                    if (minKursanzahl >= maxKursanzahl + 1) {
                        // Nếu đã duyệt hết tất cả các giảng viên với kursanzahl nhỏ hơn maxKursanzahl + 1 mà không tìm thấy
                        // thì chuyển sang khung giờ tiếp theo
                        minKursanzahl = 0; // Reset lại minKursanzahl cho khung giờ mới
                        khungGioIndex++; // Chuyển sang khung giờ tiếp theo
                    } else {
                        minKursanzahl++;
                    }
                }
            }
        
            //return giangVienPhuHop?.id;
            //return khungGio;
            return giangVienPhuHop ? { giangVienId: giangVienPhuHop.id, khungGio, ngay } : null;
        }
        
        async function timPhongTrong(client, khungGioPhuHop, ngay) {
            const result = await client.query(`
              SELECT id
              FROM Raum
              WHERE id NOT IN (
                SELECT raum_id
                FROM Kurs
                WHERE (
                  ((startTime <= $1 AND endTime > $1) OR 
                  (startTime < $2 AND endTime >= $2) OR
                  (startTime >= $1 AND endTime <= $2)) AND wochentag = $3
                )
              )
              LIMIT 1
            `, [khungGioPhuHop.startTime, khungGioPhuHop.endTime, ngay]);
          
            return result.rows[0]?.id;
        }
          
        async function luuKhoaHocMoiVaoDatabase(client, name, ngay, khungGio, giangVienId, phongId) {
            const result = await client.query(`
              INSERT INTO Kurs (name, wochentag, startTime, endTime, mitarbeiter_id, raum_id, fachbereich_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING id
            `, [name, ngay, khungGio.startTime, khungGio.endTime, giangVienId, phongId, fachbereichId]);
          
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

            // ... (Logic xử lý trước đó) ...
            const client = await pool.connect();
            const ngay = await timNgayItTietNhat(client, fachbereichId);
            let cacKhungGioPhuHop = [];
            let ngayChon = null;
            let giangVienVaKhungGioPhuHop = null;
            let phongTrong = null;
            let ngayIndex = 0; // Khởi tạo chỉ số ngày
            
            while (!giangVienVaKhungGioPhuHop && ngayIndex < ngay.length) {
                // Duyệt qua các ngày theo thứ tự số tiết tăng dần
                ngayChon = ngay[ngayIndex].name;
                cacKhungGioPhuHop = await timCacKhungGioPhuHop(client, fachbereichId, ngayChon);

                if (cacKhungGioPhuHop.length > 0) {
                    // Tìm giảng viên và phòng phù hợp cho ngày này
                    giangVienVaKhungGioPhuHop = await timGiangVienVaKhungGioPhuHop(client, cacKhungGioPhuHop, ngayChon);
                    if (giangVienVaKhungGioPhuHop) {
                        phongTrong = await timPhongTrong(client, giangVienVaKhungGioPhuHop.khungGio, giangVienVaKhungGioPhuHop.ngay);
                        break; // Thoát vòng lặp khi tìm thấy khung giờ, giảng viên và phòng phù hợp
                    }
                }
                ngayIndex++;
            }
                // Bước 5: Tạo khóa học mới
            const newKursId = await luuKhoaHocMoiVaoDatabase(client, name, ngayChon, giangVienVaKhungGioPhuHop.khungGio, giangVienVaKhungGioPhuHop.giangVienId, phongTrong);

            await client.release();

            res.json({ message: 'Tạo khóa học mới thành công!', ketQua: giangVienVaKhungGioPhuHop, phong: phongTrong, kurID: newKursId});
                    
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