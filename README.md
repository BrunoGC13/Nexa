# Nexa

This is my project for managing todos and calendar events.
This project is based on the NodeJS framework. 

![Node.js](https://img.shields.io/badge/node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---
This project is currently ONLY the backend, it's purpose is to make the connections and store data.
You fellow traveller can design your own frontend website, but I'm probably going to create my own, but currently I am working on the
basic functionality of my project.

---

## Content

1. [How to setup](#how-to-setup)

## What can it do?

The backend itself can retrieve user data to log users in and create users. 
It can retrieve data to create, delete, finish and get todos.
For example, if you want to retrieve data about a todo, you can get the details by sending a GET request to `/api/todos/get` and add a user and todo name to the body of the request.

Currently in development - connect to a CalDAV calendar (with auth) to retrieve events and add, delete and edit them. 

It can remind you to finish your todos by sending you a email reminder. 
it also features a review what you have done and what not, and automatically assigns the todo for the next day.
If you finish your todos every day you can get a-day-off ticket which you can determine when to redeem.


---


## How to setup

### Linux

0. Make sure to have the required packages installed!

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm -y
```

1. First, you run:
```
git clone https://github.com/BrunoGC13/Nexa.git
```
2. Then run:

```bash
cd Nexa/api/
npm install
npm run run
```
3. Then go to: http://localhost:3000/check - the page should say that Nexa was successfully installed, if that's the case, you successfully installed Nexa!
4. Now you can go on to learn more about the [Endpoints](#endpoints).


### Windows

0. Make sure you have [NodeJS](https://nodejs.org/en/download) installed (download the pre-built - npm is included)

1. Then you can follow along the linux tutorial at step 1.

---

## Endpoints

### ToDos

There are 5 endpoints for the todos:

- /api/todos/get - gets a todos data by sending a GET request with a name and user in a query.
- /api/todos/getByUser - gets all todos with their data from a specific user (also uses the user as a query and GET request)
- /api/todos/finish - finishs a todo by sending a PUT request with the name of the todo and user of the todo as a body.
- /api/todos/delete - deletes a todo by sending a POST request with the name of the todo and user of the todo as a body.
- /api/todos/create - creates a todo by sending a POST request with the name, user and priority of the todo as a body.

### Users

There are 2 endpoints for the users:

- /api/user/create - creates a user by sending a POST request with the users name, password and email as a body.
- /api/user/login - send a POST request with the users name and password to look if the user can login.
