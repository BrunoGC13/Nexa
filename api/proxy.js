// === Imports ===
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// === Modules ===
const hash = require('./modules/hash');
const saveUser = require('./modules/saveUser');
const login = require('./modules/loginUser');

const createTodo = require('./modules/todos/create');
const deleteTodo = require('./modules/todos/delete');
const finishTodo = require('./modules/todos/finish');
const getTodo = require('./modules/todos/get');

const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// === User Endpoints ===

app.post('/api/user/login', async (req, res) => {
  const user = req.headers["user"];
  const password = req.headers["password"];

  if (!user || !password) {
    res.status(500).send("User and Password headers are required!");
    return;
  }

  console.log("Benutzer: " + user);
  console.log("Passwort: " + password);

  try {
    const hashedPassword = await hash.hashPassword(password);
    console.log("Hashed Password:", hashedPassword);

    res.send(`Erfolgreich! Hashed Password: ${hashedPassword}`);

    login.login(user, hashedPassword)

  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send("Error hashing password");
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
    await createTodo.createTodo(name, priority, user, currentTime);
    res.send("ToDo added successfully!");
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).send("Error creating todo");
  }
});

app.delete('/api/todos/delete', async (req, res) => {
  const { name, user } = req.body;

  if (!name || !user) {
    res.status(500).send("User and todo name are required!");
    return;
  }

  deleteTodo.deleteTodo(name, user);

  res.send("ToDo deleted successfully!");
});

app.put('/api/todos/finish', async (req, res) => {
  const { name, user } = req.body;

  if (!name || !user) {
    res.status(500).send("User and todo name are required!");
    return;
  }

  finishTodo.finishTodo(name, user);

  res.send("ToDo updated successfully!");

});

app.get('/api/todos/get', async (req, res) => {
  const { name, user } = req.body;

  if (!name || !user) {
    res.status(500).send("User and todo name are required!");
    return;
  }

  getTodo.getTodo(name, user)
});

// === Start the server ===
app.listen(port, () => {
  console.log("Server running on http://localhost:3000");
});