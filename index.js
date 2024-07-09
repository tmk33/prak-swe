const express = require('express');
const { Pool } = require('pg'); 
require('dotenv').config();
const cors = require('cors');

const authenticateAdmin = require('./middleware/auth');

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

const startServer = () => {
  const server = app.listen(3001, () => {
    console.log(`Server listening on port 3001`);
  });
  return server;
};

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

const generateVeranstaltung = require('./utils/generateVeranstaltung')(pool); // Truyền pool vào module
const krankMeldung = require('./utils/krankMeldung')(pool); // Truyền pool vào module


// Sử dụng middleware để phân tích JSON
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001', // Cho phép yêu cầu từ frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Cho phép gửi cookie và thông tin xác thực
}));

// Import và sử dụng các routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/student', studentRoutes(pool)); // Truyền pool vào routes

const mitarbeiterRoutes = require('./routes/mitarbeiterRoutes');
app.use('/mitarbeiter', mitarbeiterRoutes(pool));

const raumRoutes = require('./routes/raumRoutes');
app.use('/raum', raumRoutes(pool));

const fachbereichRoutes = require('./routes/fachbereichRoutes');
app.use('/fachbereich', fachbereichRoutes(pool));

const kursRoutes = require('./routes/kursRoutes');
app.use('/kurs', kursRoutes(pool));

const sonderveranstaltungRoutes = require('./routes/sonderveranstaltungRoutes');
app.use('/sonderveranstaltung', sonderveranstaltungRoutes(pool));

app.post('/kurs/add', authenticateAdmin.authenticateAdmin, generateVeranstaltung.generateVeranstaltung);
app.post('/krankmeldung', authenticateAdmin.authenticateAdmin, krankMeldung.krankMeldung);

app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM Mitarbeiter WHERE email = $1', [email]);
      const mitarbeiter = result.rows[0];
  
      if (!mitarbeiter) {
        return res.status(401).json({ error: 'Email or password is incorrect' });
      }
  
      const passwordMatch = await bcrypt.compare(password, mitarbeiter.password_hash);
      if (!passwordMatch || mitarbeiter.rolle !== 'Admin') {
        return res.status(401).json({ error: 'Email or password is incorrect' });
      }
  
      const token = jwt.sign({ id: mitarbeiter.id, rolle: mitarbeiter.rolle }, jwtSecret, { expiresIn: '1h' }); // Tạo JWT với thời gian hết hạn 1 giờ
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.put('/admin/:id/password', authenticateAdmin.authenticateAdmin, async (req, res) => { // Chỉ admin mới được phép đổi mật khẩu
    const { id } = req.params;
    const { newPassword } = req.body;
  
    try {
      const saltRounds = 10; // Số vòng băm, càng cao càng an toàn
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  
      await pool.query('UPDATE Mitarbeiter SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
      res.json({ message: 'Password has been updated' });
    } catch (err) {
      console.error('Error updating password:', err);
      res.status(500).json({ error: 'Server error' });
    }
});

async function generatePasswordHash(password) {
    const saltRounds = 10; // Số vòng băm, càng cao càng an toàn
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

/*
const password = 'admin'; // Thay bằng mật khẩu bạn muốn đặt
generatePasswordHash(password)
    .then(hash => console.log("This is Hash password for Admin id 1 for testing purpose " + hash))
    .catch(err => console.error('Error:', err));
*/

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

module.exports = { app, startServer };
