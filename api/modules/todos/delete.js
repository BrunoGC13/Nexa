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

function deleteTodo(name, user) {
    const sql = `DELETE FROM todos WHERE name = ? AND from_user = ?`;
    const values = [name, user];

    pool.query(sql, values, function (err, result) {
        if (err) {
            console.error("Error deleting todo: ", err);
            throw err;
        }

        if (result.affectedRows > 0) {
            console.log(`ToDo successfully deleted: ${name} by user: ${user}`);
        } else {
            console.log("No todo found with the given name and user.");
        }
    });
};

module.exports = { deleteTodo };