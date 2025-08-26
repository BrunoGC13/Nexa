const mysql = require('mysql');
const path = require('path');

const hash = require('./hash');

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

async function userLogin(user, userPassword) {
    const sql = `SELECT name, password FROM users WHERE name = ?`;
    const values = [user];

    return new Promise((resolve, reject) => {
        pool.query(sql, values, async (err, result) => {
            if (err) {
                console.error("Error:", err);
                reject(err);
                return;
            }
            if (result.length > 0) {
                const dbUser = result[0];
                console.log("SQL Query Result:", dbUser);
                if (dbUser.name === user) {
                    try {
                        const match = await hash.comparePasswords(userPassword, dbUser.password);
                        resolve(match);
                    } catch (err) {
                        console.error("Error during password comparison:", err);
                        reject(err);
                    }
                } else {
                    console.log("No match: Invalid username or password.");
                    resolve(false);
                }
            } else {
                console.log("No user found with the given name.");
                resolve(false);
            }
        });
    });
}

module.exports = { userLogin };