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
DELETE  /student/:id/:name  delete Student by ID and Name  
PUT     /student/:id    update existing Student data (which value set null is unchange)  
  
{  
  "name": null,     //name unchange  
  "email": null,    //email unchange  
  "geburtsdatum": null,     //geburtsdatum unchange  
  "fachbereich_id": 2       //fachbereich_id change to 2  
}  
  
GET     /mitarbeiter     get all Mitarbeiter  
GET     /raum    get all Raum  
GET     /kurs    get all Kurs  
GET     /kurs/:fachbereich_id get Kurs by Fachbereich  

