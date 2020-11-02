const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('hello.ejs');
});

app.get('/rec_list', (req, res) => {
    res.render('rec_list.ejs');
});

app.get('/sns_list', (req, res) => {
    res.render('sns_list.ejs');
});

app.get('/timer', (req, res) => {
    res.render('timer.ejs');
});

app.get('/camera', (req, res) => {
    res.render('camera.ejs');
});

app.get('/goal_list', (req, res) => {
    res.render('goal_list.ejs');
});

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
