// test/student.routes.test.js
const request = require('supertest');
const { app, startServer } = require('../index');  // Import ứng dụng Express
const { Pool } = require('pg'); 
require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

describe('Student Routes', () => {
  let testStudent;
  let token;
  let server;

  before(async () => {
    server = startServer();

    try {
      // Đăng nhập để lấy JWT token
      const loginResponse = await request(app)
          .post('/admin/login')
          .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }); 
      token = loginResponse.body.token; 
      console.log('Token: ', token);
      await pool.query('BEGIN'); 

      console.log('Connected to database'); 
    } catch (err) {
      console.error('Error connecting to database or creating test student:', err);
      throw err; 
    }
  });

  after(async () => {
    server.close(); 

    try {
      await pool.query('ROLLBACK');
      await pool.end();
    } catch (err) {
      console.error('Error rolling back transaction or ending pool:', err);
    }
  });

  describe('POST /student', () => {
    it('should add a new student', (done) => {
      const newStudent = {
        name: 'New Student',
        email: 'newstudent@example.com',
        geburtsdatum: '2000-01-01',
        fachbereich_id: 1 // Điều chỉnh theo dữ liệu của bạn
      };

      request(app)
        .post('/student')
        .set('Authorization', `Bearer ${token}`) 
        .send(newStudent)
        .expect(201) // Created
        .then(res => {
          testStudent = res.body; // Lưu thông tin sinh viên mới để sử dụng trong test DELETE
          expect(res.body).to.have.property('id');
          expect(res.body.name).to.equal(newStudent.name);
          expect(res.body.email).to.equal(newStudent.email);
          expect(res.body.fachbereich_id).to.equal(newStudent.fachbereich_id);
          done();
        })
        .catch(done);
    });
  });

  describe('DELETE /student/:id/:name', () => {
    it('should delete a student', (done) => {
      request(app)
        .delete(`/student/${testStudent.id}/${testStudent.name}`)
        .set('Authorization', `Bearer ${token}`) 
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('message', 'Student id ' + testStudent.id + ' deleted!');
          done();
        })
        .catch(done);
    });
  });
});
