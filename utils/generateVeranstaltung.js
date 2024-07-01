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

    const generateVeranstaltung = async () => { 
        try {
            // 1. Tìm thứ trong tuần có k nhỏ nhất và lấy ngày đó ra

            // 2. tìm các veranstaltung có cùng fachbereich trong thứ đó và tìm ra giờ phù hợp

            // 3. tìm các Lehrperson có só k nhỏ nhất. đầu ra là 1 array Lehrperson

            // 4. duyệt từng phần tử trong array và so sánh xem giờ đã tìm ở bước 2 có phù hợp với Lehrperson đó không, nếu không thì tìm lehrperson tiếp theo

            // 5. nếu duyệt hết mà không tìm được Lehrperson phù hợp thì tìm Lehrperson có số k+1 tiếp theo

            // 6. nếu không tìm được Lehrperson phù hợp thì quay lại bước 2 tìm khung giờ phù hợp tiếp theo

            // 7. nếu duyệt hết các k mà không tìm được thì quay lại bước 1 tìm ngày tiếp theo k+1

            // 8. tìm phòng trống có thời gian đó
            
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