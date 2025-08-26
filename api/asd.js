const express = require('express');

const app = express();

app.get('/test', (req, res) => {
    console.log("got");
    res.send("HI!");
});

app.listen(5000);