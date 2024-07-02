const express = require('express');
const { Pool } = require('pg'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

const generateVeranstaltung = require('./utils/generateVeranstaltung')(pool); // Truyền pool vào module

// Sử dụng middleware để phân tích JSON
app.use(express.json());

// Import và sử dụng các routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/student', studentRoutes(pool)); // Truyền pool vào routes

const mitarbeiterRoutes = require('./routes/mitarbeiterRoutes');
app.use('/mitarbeiter', mitarbeiterRoutes(pool));

const raumRoutes = require('./routes/raumRoutes');
app.use('/raum', raumRoutes(pool));

const kursRoutes = require('./routes/kursRoutes');
app.use('/kurs', kursRoutes(pool));


app.get('/generate', async (req, res) => { // async ở đây
    const currentDateTime = await generateVeranstaltung.getCurrentDateTime(); // await ở đây
    res.json({ currentDateTime });
});

app.listen(port, () => {
	console.log(`Server đang chạy tại http://localhost:${port}`);
});
