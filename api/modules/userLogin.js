const mysql = require('mysql');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Rest of the code remains the same

const db_user = process.env.DB_USER;
const db_passwd = process.env.DB_PASSWD;
const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;

// === MySQL Connection Pool ===
const pool = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_passwd,
    database: db_name,
    connectionLimit: 10
});

function login(user, hashedPassword) {
    const sql = `SELECT name, password FROM users WHERE name = ?`;
    const values = [user];

    pool.query(sql, values, function (err, result) {
        if (err) {
            console.error("Error:", err);
            throw err;
        }

        if (result.length > 0) {
            const dbUser = result[0];
            console.log("SQL Query Result:", dbUser);

            if (user === dbUser.name && hashedPassword === dbUser.password) {
                console.log("Match!");
            } else {
                console.log("No match: Invalid username or password.");
            }
        } else {
            console.log("No user found with the given name.");
        }
    });
}

export { login };