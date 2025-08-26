// === Imports ===
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require("path");
const jwt = require('jsonwebtoken');

// === Modules ===
const hash = require('./modules/hash');
const saveUser = require('./modules/saveUser');
const login = require('./modules/userLogin');

const createTodo = require('./modules/todos/create');
const deleteTodo = require('./modules/todos/delete');
const finishTodo = require('./modules/todos/finish');
const getTodo = require('./modules/todos/get');

const reminder = require('./modules/automation');
reminder.run();

const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const secret_key = process.env.SECRET_KEY;

// === User Endpoints ===

app.post('/api/user/login', async (req, res) => {
  const { user, password } = req.body;

  const dbUser = await login.userLogin(user, password);
  if (dbUser) {

    const token = jwt.sign({ userId: dbUser.id, username: dbUser.name }, secret_key, { expiresIn: '1h' });
    res.json({ token }); 
  } else {
    res.status(401).send("Invalid username or password.");
  }
});

app.post('/api/user/create', async (req, res) => {
  const { user, password, email } = req.body;

  const currentTime = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  if (!user || !password || !email) {
    res.status(500).send("User, Password, and Email are required!");
    return;
  }

  console.log("Benutzer: " + user);
  console.log("Passwort: " + password);
  console.log("E-Mail: " + email);

  try {
    const hashedPassword = await hash.hashPassword(password);
    console.log("Hashed Password:", hashedPassword);

    saveUser.saveUser(user, hashedPassword, email, currentTime);
    res.send(`User created successfully!`);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
});

// === ToDo Endpoints ===

app.post('/api/todos/create', async (req, res) => {
  const { name, priority, user } = req.body;
  const currentTime = new Date().toISOString().split('T')[0];

  if (!name || !priority || !user) {
    res.status(500).send("User, priority, and name are required!");
    return;
  }

  try {
    const result = await createTodo.createTodo(name, priority, user, currentTime);
    console.log("Fetched Todo:", result);
    res.send(result);
  } catch (err) {
    res.status(500).send("Error fetching todo: " + err.message);
    console.error("Error fetching todo:", err);
  }
});

app.delete('/api/todos/delete', async (req, res) => {
  const { name, user } = req.body;

  if (!name || !user) {
    res.status(500).send("User and todo name are required!");
    return;
  }

  try {
    const result = await deleteTodo.deleteTodo(name, user);
    console.log("Fetched Todo:", result);
    res.send(result);
  } catch (err) {
    res.status(500).send("Error fetching todo: " + err.message);
    console.error("Error fetching todo:", err);
  }
});

app.put('/api/todos/finish', async (req, res) => {
  const { name, user } = req.body;

  if (!name || !user) {
    res.status(500).send("User and todo name are required!");
    return;
  }

  try {
    const result = await finishTodo.finishTodo(name, user);
    console.log("Fetched Todo:", result);
    res.send(result);
  } catch (err) {
    res.status(500).send("Error fetching todo: " + err.message);
    console.error("Error fetching todo:", err);
  }

});

app.get('/api/todos/get', async (req, res) => {
  const { name, user } = req.query; // Ändere req.body zu req.query

  if (!name || !user) {
    res.status(400).send("User and todo name are required!");
    return;
  }

  try {
    const result = await getTodo.getTodo(name, user);
    console.log("Fetched Todo:", result);
    res.send(result);
  } catch (err) {
    res.status(500).send("Error fetching todo: " + err.message);
    console.error("Error fetching todo:", err);
  }
});

app.get('/api/todos/getByUser', async (req, res) => {
  const { user } = req.query; // Ändere req.body zu req.query

  if (!user) {
    res.status(400).send("User is required!");
    return;
  }

  try {
    const result = await getTodo.getTodoByUser(user);
    console.log("Fetched Todo:", result);
    res.send(result);
  } catch (err) {
    res.status(500).send("Error fetching todo: " + err.message);
    console.error("Error fetching todo:", err);
  }
});


// === Check Endpoint ===
app.get("/check", (req, res) => {
  res.sendFile(path.join(__dirname, "check.html"));
});


// === Start the server ===
app.listen(port, () => {
  console.log("Server running on http://localhost:3000");
  console.log("🚀 Hey there! Seems like you successfully started Nexa!")
  console.log("✅ To check if Nexa is working visit: http://localhost:3000/check")
});