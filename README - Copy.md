It is built using:

Express.js: A minimalist and flexible web framework for Node.js.  
Node.js: A server-side JavaScript runtime environment.  
PostgreSQL: A powerful and scalable open-source relational database management system.

Installation and Setup
1. Prerequisites:

Node.js and npm: Download and install from https://nodejs.org/.
PostgreSQL: Download and install from https://www.postgresql.org/. Make sure you remember your PostgreSQL username, password, and database name.

2. Clone the repository:

Bash
git clone https://github.com/tmk33/prak-swe.git
cd [project-directory-name]

3. Install dependencies:

cmd:
npm install 

4. Setup .env file:

Create a .env file in the project root directory and fill in the following information:

PGUSER=[Your PostgreSQL username]  
PGHOST=[Your PostgreSQL host address (e.g., localhost)]  
PGDATABASE=[Your PostgreSQL database name]  
PGPASSWORD=[Your PostgreSQL password]  
PGPORT=5432 # default port  

5. Restoring Database from Backup (myproject.sql)

- Navigate to the directory where your myproject.sql file is located.
- Execute the following command, replacing placeholders with your actual database information:  
psql -U [Your PostgreSQL username] [Your database name] < myproject.sql  
example: psql -U postgres myproject < myproject.sql

6. Start the server:

cmd:
npm start

The server will be running at http://localhost:[PORT] (e.g., http://localhost:3000).

API Endpoints

GET     /student    get all Student  
POST    /student    create new Student  
 {  
&nbsp;&nbsp;        "name": "Lian Tritten",  
&nbsp;&nbsp;        "email": "test1@example.com",  
&nbsp;&nbsp;        "geburtsdatum": "2000-09-24",  
&nbsp;&nbsp;        "fachbereich_id": 1  
}  
DELETE  /student/:id/:name  delete Student by ID and Name  
PUT     /student/:id    update existing Student data (which value set null is unchange)  
  
{  
&nbsp;&nbsp;  "name": null,     //name unchange  
&nbsp;&nbsp;  "email": null,    //email unchange  
&nbsp;&nbsp;  "geburtsdatum": null,     //geburtsdatum unchange  
&nbsp;&nbsp;  "fachbereich_id": 2       //fachbereich_id change to 2  
}  
  
GET     /mitarbeiter     get all Mitarbeiter  
POST    /mitarbeiter    create new Student  
 {
&nbsp;&nbsp;        "name": "Johann Mandel",  
&nbsp;&nbsp;        "email": "johann.mandel@example.com",  
&nbsp;&nbsp;        "geburtsdatum": "1990-03-09",  
&nbsp;&nbsp;        "rolle": "Dozent",  //oder Admin, Marketing  
}
  
GET     /raum    get all Raum  
POST    /raum    create new Raum with key "name", "ort"  
{  
&nbsp;&nbsp;    "name": "new Raum",  
&nbsp;&nbsp;    ""ort": "Campus A"  
}  

  
GET     /kurs    get all Kurs  
GET     /kurs/:fachbereich_id get Kurs by Fachbereich  
GET     /kurs/dozent/id/:mitarbeiter_id     get Kurs by DozentId  
localhost:3000/kurs/dozent/id/5  
GET     /kurs/dozent/name/:mitarbeiterName  get Kurs by Dozent Name  
localhost:3000/kurs/dozent/name/Louise%20Kunz  
DELETE  /kurs/:id   delete Kurs

POST    /kurs/add   add new Kurs with key "name" and "fachbereichId"  
{  
&nbsp;&nbsp;    "name": "new Kurs",  
&nbsp;&nbsp;    "fachbereichId": 1  
}  

GET     /fachbereich    get all Fachbereich  
POST    /fachbereich    create new Fachbereich with key "name"  
{  
&nbsp;&nbsp;    "name": "new Fachbereich",  
}  

GET     /sonderveranstaltung    get all Sonderveranstaltung  
POST    /sonderveranstaltung    create new Sonderveranstaltung  
{  
&nbsp;&nbsp;    "name": "Workshop Python",  
&nbsp;&nbsp;    "date": "30.07.2024",  
&nbsp;&nbsp;    "wochentag": "tue",  
&nbsp;&nbsp;    "beschreibung":"Einfuehrung in die Programmiersprache Python",  
&nbsp;&nbsp;    "dauertStunden":"4"  
}  
  
POST    /krankmeldung   krankmeldung  
{  
&nbsp;&nbsp;    "mitarbeiterId": 5,  
&nbsp;&nbsp;    "ngay": "wed",  
&nbsp;&nbsp;    "date":"12-02-2024"  
}  

POST    /admin/login    admin login to get token, this token use to access endpoints like /kurs/add, /krankmeldung,...  
{  
&nbsp;&nbsp;    "email": "admin@example.com",  //Below is the admin account  
&nbsp;&nbsp;    "password": "testpassword"      //I have created in the database  
}  

response  
{  
&nbsp;&nbsp;    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  eyJpZCI6NCwicm9sbGUiOiJBZG1pbiIsImlhdCI6MTcyMDI2MDA5MywiZXhwIjoxNzIwMjYzNjkzfQ.  eAf9t0ftwZZZrGUSnakShH_3VIQfYQck6g8RjWTIsXg"  
}   //put this token to Header of every endpoint API call  

example fetch API endpoint /kurs/add  
fetch('/kurs/add', {  
&nbsp;&nbsp;  method: 'POST',  
&nbsp;&nbsp;  headers: {  
&nbsp;&nbsp;&nbsp;&nbsp;    'Content-Type': 'application/json',  
&nbsp;&nbsp;&nbsp;&nbsp;    'Authorization': `Bearer [token]`  
&nbsp;&nbsp;  },  
&nbsp;&nbsp;  body: JSON.stringify(courseData) // Dữ liệu khóa học  
})  
.then(response => { /* Xử lý phản hồi */ })  
.catch(error => { /* Xử lý lỗi */ });  


PUT     /admin/:id/password     update admin password, need admin token  
{  
&nbsp;&nbsp;    "newPassword": "newPasswordForAdmin"  
}  




