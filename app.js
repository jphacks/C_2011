const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.set("views","functions/views");
app.get('/tools', (req, res) => {
    res.render('index.ejs');
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

app.get('/fireTest', (req, res) => {
    res.render('fireTest.ejs');
});

// サーバーを起動するコードを貼り付けてください
const port = 3000;
app.listen(port,()=>{
    console.log("Open index.html->http://localhost:"+port);
    console.log("Open tools->http://localhost:"+port+"/tools");
});