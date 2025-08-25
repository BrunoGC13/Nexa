const mysql = require('mysql');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

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

function createTodo(name, priority, user, currentTime) {
    const sql = `INSERT INTO todos (name, created_at, for_day, finished, priority, from_user) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, currentTime, currentTime, false, priority, user];


    return new Promise((resolve, reject) => {

        pool.query(sql, values, function (err, result) {
            if (err) {
                console.error("Error creating todo:", err);
                reject(err);
                return;
            }
            console.log("Successfully created todo:", result.insertId);
            resolve(result);
        });

    });
}

module.exports = { createTodo };