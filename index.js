const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/profile', (req, res) => {
    fs.readFile('user.json', (err, data) => {
        if (err) return res.status(500).send('Error reading user file');
        res.json(JSON.parse(data));
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('user.json', (err, data) => {
        if (err) return res.status(500).send('Error reading user file');
        const users = JSON.parse(data);
        const user = users.find(user => user.username === username);

        if (!user) {
            return res.json({ status: false, message: "User Name is invalid" });
        }
        if (user.password !== password) {
            return res.json({ status: false, message: "Password is invalid" });
        }
        return res.json({ status: true, message: "User Is valid" });
    });
});

app.get('/logout/:username', (req, res) => {
    const username = req.params.username;
    res.send(`<b>${username} successfully logged out.</b>`);
});

app.use((err, req, res, next) => {
    res.status(500).send('Server Error');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
