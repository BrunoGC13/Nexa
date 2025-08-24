const mysql = require('mysql');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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

function saveUser(user, password, email, currentTime) {
    const sql = `INSERT INTO users (name, password, created_at, email) VALUES (?, ?, ?, ?)`;
    const values = [user, password, currentTime, email];

    pool.query(sql, values, function (err, result) {
        if (err) {
            console.error("Error inserting user:", err);
            throw err;
        }
        console.log("User inserted successfully with ID:", result.insertId);
    });
}

module.exports = { saveUser };