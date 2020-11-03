const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/fireTest', (req, res) => {
    res.render('fireTest.ejs');
});

app.get('/rec_list', (req, res) => {
    res.render('rec_list.ejs');
});

app.get('/sns_list', (req, res) => {
    res.render('sns_list.ejs');
});

app.get('/timer', (req, res) => {
    res.render('timer.ejs', {start : ""});
});

app.post('/timer', (req, res) => {
    res.render('timer.ejs', { start : req.body.startTime })
    console.log(req.body.startTime);
})

app.get('/camera', (req, res) => {
    res.render('camera.ejs');
});

app.get('/goal_list', (req, res) => {
    res.render('goal_list.ejs');
});

exports.app = functions.https.onRequest(app);