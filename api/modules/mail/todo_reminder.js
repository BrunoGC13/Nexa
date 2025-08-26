const nodemailer = require('nodemailer');
const mysql = require('mysql');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const db_user = process.env.DB_USER;
const db_passwd = process.env.DB_PASSWD;
const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;

const mail_host = process.env.MAIL_SERVER;
const mail_port = process.env.MAIL_PORT;
const mail_secure = process.env.MAIL_SSL;
const mail_user = process.env.MAIL_SENDER;
const mail_password = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: mail_host,
    port: mail_port,
    secure: mail_secure,
    auth: {
        user: mail_user,
        pass: mail_password,
    },
});

// === MySQL Connection Pool ===
const pool = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_passwd,
    database: db_name,
    connectionLimit: 10
});

async function getUnfinishedTodos() {
    const sql = `SELECT name, from_user FROM todos WHERE finished = ?`;
    const values = [0];
    return new Promise((resolve, reject) => {
        pool.query(sql, values, async (err, results) => {
            if (err) {
                console.error("Error getting todos: ", err);
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

async function getUserEmails(user) {
    const sql = `SELECT email FROM users WHERE name = ?`;
    const values = [user];

    return new Promise((resolve, reject) => {
        pool.query(sql, values, function (err, result) {
            if (err) {
                console.error("Error getting emails: ", err);
                reject(err);
                return;
            }
            if (result.length > 0) {
                resolve(result[0].email);
            } else {
                resolve(null); 
            }
        });
    });
}

async function sendEmails(email, todos) {
    const todoList = todos.map(todo => `- ${todo.name}`).join('\n');

    await transporter.sendMail({
        from: 'project@brunoglotz.com',
        to: email,
        subject: "You have unfinished todos!",
        text: `You need to finish the following todos:\n${todoList}`
    });
}

async function main() {
    const todos = await getUnfinishedTodos();

    const userTodoMap = {};

    for (const todo of todos) {
        if (!userTodoMap[todo.from_user]) {
            userTodoMap[todo.from_user] = [];
        }
        userTodoMap[todo.from_user].push(todo);
    }

    for (const user in userTodoMap) {
        const email = await getUserEmails(user);
        if (email) {
            await sendEmails(email, userTodoMap[user]);
            console.log(`Email sent to ${email} with todos.`);
        } else {
            console.log(`No email found for user: ${user}`);
        }
    }
}

module.exports = { main };