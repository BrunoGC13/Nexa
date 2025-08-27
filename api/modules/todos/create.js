const mysql = require('mysql');
const path = require('path');
const { resourceLimits } = require('worker_threads');

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

async function validateTag(tag) {
    console.log(typeof (tag));
    const sql = `SELECT name FROM tags WHERE name = ?`;
    const values = [tag];

    return new Promise((resolve, reject) => {

        pool.query(sql, values, function (err, result) {
            if (err) {
                console.error("Error getting tag:", err);
                reject(err);
                return;
            }
            if (result.length === 0) {
                resolve(false);
                console.log(result);
            } else {
                console.log("Successfully got tag:", result);
                resolve(true);
            }

        });

    });
}

async function createTodo(name, priority, user, currentTime, tags) {
    const sql = `INSERT INTO todos (name, created_at, for_day, finished, priority, from_user, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, currentTime, currentTime, false, priority, user, tags];

    const tagExists = await validateTag(tags);

    return new Promise((resolve, reject) => {

        if (tagExists) {

            pool.query(sql, values, function (err, result) {
                if (err) {
                    console.error("Error creating todo:", err);
                    reject(err);
                    return;
                }
                console.log("Successfully created todo:", result.insertId);
                resolve(result);
            });

        } else {
            resolve("Tag does not exist!")
        }
    });

};

module.exports = { createTodo };