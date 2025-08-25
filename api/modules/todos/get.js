const { get } = require('http');
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

function getTodo(name, user) {
    const sql = `SELECT name, from_user FROM todos WHERE name = ? AND from_user = ?`;
    const values = [name, user];

    return new Promise((resolve, reject) => {
        pool.query(sql, values, function (err, result) {
            if (err) {
                console.error("Error getting todo: ", err);
                reject(err);
                return;
            }

            if (result.length > 0) {
                console.log(`Successfully got todo: ${name} by user: ${user}`);
                resolve(result);
            } else {
                console.log("No todo found with the given name and user.");
                resolve([]);
            }
        });
    });
}

function getTodoByUser(user) {
    const sql = `SELECT name FROM todos WHERE from_user = ?`;
    const values = [user];

    return new Promise((resolve, reject) => {
        pool.query(sql, values, function (err, result) {
            if (err) {
                console.error("Error getting todo: ", err);
                reject(err);
                return;
            }

            if (result.length > 0) {
                console.log(`Successfully got todos: ${user}`);
                resolve(result);
            } else {
                console.log("No todo found with the given name and user.");
                resolve([]);
            }
        });
    });
}

module.exports = { getTodo, getTodoByUser };