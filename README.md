
Installation and Setup
1. Prerequisites:

Node.js and npm: Download and install from https://nodejs.org/.
PostgreSQL: Download and install from https://www.postgresql.org/. Make sure you remember your PostgreSQL username, password, and database name.
2. Clone the repository:

Bash
git clone https://www.gitkraken.com/learn/git/tutorials/what-is-a-git-repository
cd [project-directory-name]

3. Install dependencies:

cmd:
npm install 

4. Setup .env file:

Create a .env file in the project root directory and fill in the following information:

PORT=[Port number you want to use (e.g., 3000)]
DB_HOST=[Your PostgreSQL host address (e.g., localhost)]
DB_USER=[Your PostgreSQL username]
DB_PASSWORD=[Your PostgreSQL password]
DB_NAME=[Your PostgreSQL database name]

5. Start the server:

cmd:
npm start

The server will be running at http://localhost:[PORT] (e.g., http://localhost:3000).

API Endpoints

/students
/mitarbeiter
/raum
/kurs