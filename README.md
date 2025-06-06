# Praktikum Software Engineering Project

This project is a backend API for managing students, courses, staff, and rooms. It's designed to be used as part of a software engineering internship or course.

## Table of Contents
- [Built With](#built-with)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)

## Built With
- **Express.js:** A fast and minimalist web framework for Node.js
- **Node.js:** A JavaScript runtime environment
- **PostgreSQL:** A powerful open-source relational database system

## Installation and Setup

1. **Prerequisites:**
   - **Node.js and npm:** Download and install from [https://nodejs.org/](https://nodejs.org/).
   - **PostgreSQL:** Download and install from [https://www.postgresql.org/](https://www.postgresql.org/). Note your PostgreSQL username, password, and database name.

2. **Clone the repository:**
   ```bash
   git clone [https://github.com/tmk33/prak-swe.git](https://github.com/tmk33/prak-swe.git)
   cd prak-swe 

3. **Install dependencies:**
   ```bash
   npm install


## 4. Setup .env file:

Create a `.env` file in the project root directory and add the following information:

PGUSER=[Your PostgreSQL username]  
PGHOST=[Your PostgreSQL host address (e.g., localhost)]  
PGDATABASE=[Your PostgreSQL database name]  
PGPASSWORD=[Your PostgreSQL password]  
PGPORT=5432 # default port  
JWT_SECRET=testpassword

## 5. Restore Database from Backup (Optional)

If you have a PostgreSQL database backup file (usually with the `.sql` extension), you can restore it to your database:

1. **Navigate:** Open your terminal or command prompt and go to the directory where your backup file is located.

2. **Restore:** Run the following command, replacing the placeholders with your actual database information:

   ```bash
   psql -U [Your PostgreSQL username] [Your database name] < [your_backup_file.sql]

  example: psql -U postgres swe < swe.sql

## 6. Start the Server

Once you have completed the setup, you can start the server by running the following command in your terminal:

    ```bash
    npm start


## 7. API
The server will be running at http://localhost:[PORT] (e.g., http://localhost:3000).

API Endpoints

# API Endpoints

The server will be running at `http://localhost:[PORT]` (e.g., `http://localhost:3000`).

## Student

### GET /student
Get all students

### POST /student
Create a new student
```json
{
    "name": "Lian Tritten",
    "email": "test1@example.com",
    "geburtsdatum": "2000-09-24",
    "fachbereich_id": 1,
    "semester":2
}
```

### DELETE /student/:id/:name  
Delete Student by ID and Name

### PUT    /student/:id    
update existing Student data (which value set null is unchange)  
```json
{  
    "name": null,     //name unchange  
    "email": null,    //email unchange  
    "geburtsdatum": null,     //geburtsdatum unchange  
    "fachbereich_id": 2,       //fachbereich_id change to 2  
    "semester":null
}
```
  
### GET     /mitarbeiter     
get all Mitarbeiter  

### GET     /mitarbeiter/:id    
get Mitarbeiter by ID  

### POST    /mitarbeiter    
create new Student  
```json
{
    "name": "Johann Mandel",  
    "email": "johann.mandel@example.com",  
    "geburtsdatum": "1990-03-09",  
    "rolle": "Dozent",  //oder Admin, Marketing  
}
```
  
### GET     /raum    
get all Raum  

### GET     /raum/:id   
get Raum by ID  

### POST    /raum    
create new Raum with key "name", "ort"  
```json
{  
    "name": "new Raum",  
    "ort": "Campus A"  
}  
```

### DELETE  /raum/:id
Deletes a room by its ID. Requires admin authentication.
Example: `DELETE http://localhost:3000/raum/123`
  
### GET     /kurs    
get all Kurs  

### GET     /kurs/fachbereich/:fachbereich_id 
get Kurs by Fachbereich  

### GET     /kurs/dozent/id/:mitarbeiter_id     
get Kurs by DozentId  
localhost:3000/kurs/dozent/id/5  

### GET     /kurs/dozent/name/:mitarbeiterName  
get Kurs by Dozent Name  
localhost:3000/kurs/dozent/name/Louise%20Kunz  

### DELETE  /kurs/:id   
delete Kurs

### POST    /kurs/add   
add new Kurs with key "name" and "fachbereichId"  
```json
{  
    "name": "new Kurs",  
    "fachbereichId": 1  
}  
```

### GET     /fachbereich    
get all Fachbereich  

### GET     /fachbereich/:id   
get Fachbereich by ID  

### POST    /fachbereich    
create new Fachbereich with key "name"  
```json
{  
    "name": "Informatik2", //Informatik 2. Semester  
}  
```
### GET     /sonderveranstaltung    
get all Sonderveranstaltung  

### GET     /sonderveranstaltung/student/:id   
get all student that registered to sonderveranstaltung id

### POST    /sonderveranstaltung    
create new Sonderveranstaltung  
```json
{  
    "name": "Workshop Python",  
    "date": "30.07.2024",  
    "wochentag": "tue",  
    "beschreibung":"Einfuehrung in die Programmiersprache Python",  
    "dauertStunden":"4"  
}  
```

### POST    /sonderveranstaltung/add/student    
add student to sonderveranstaltung 
```json
{  
    "student_id": 1,  
    "sonderveranstaltung_id": 1
}  
```

### DELETE  /sonderveranstaltung/:id
delete Sonderveranstaltung by id

### POST    /krankmeldung   
krankmeldung  
```json
{  
    "mitarbeiterId": 5,  
    "wochentag": "wed",  
    "date":"12-02-2024"  
}  
```

### POST    /admin/login    
admin login to get token, this token use to access endpoints like /kurs/add, /krankmeldung,...  
```json
{  
    "email": "admin@beispiel.de",  //Below is the admin account  
    "password": "admin"      //I have created in the database  
    //oder "password":"adminpass"
}  
```
response  
```json
{  
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  eyJpZCI6NCwicm9sbGUiOiJBZG1pbiIsImlhdCI6MTcyMDI2MDA5MywiZXhwIjoxNzIwMjYzNjkzfQ.  eAf9t0ftwZZZrGUSnakShH_3VIQfYQck6g8RjWTIsXg"  
}   //put this token to Header of every endpoint API call  
```
example fetch API endpoint /kurs/add  
```javascript
fetch('/kurs/add', {  
    method: 'POST',  
    headers: {  
    'Content-Type': 'application/json',  
    'Authorization': `Bearer [token]`  
    },  
    body: JSON.stringify(courseData) // Dữ liệu khóa học  
})  
.then(response => { /* Xử lý phản hồi */ })  
.catch(error => { /* Xử lý lỗi */ });  
```

### PUT     /admin/:id/password     
update admin password, need admin token  
```json
{  
    "newPassword": "newPasswordForAdmin"  
}  
```



