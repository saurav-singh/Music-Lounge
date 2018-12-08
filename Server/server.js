var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('../Modules/session').session;
var sessionConfig = require('../.Keys/session.json');

//Import and Initialize modules
var Login = require('../Modules/login');
var login = new Login.Login();
var UploadMusic = require('../Modules/uploadMusic');
var uploadMusic = new UploadMusic.UploadMusic();
var home = require('../Modules/home');

//Setup and start the server
app.use(express.static("../"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.listen(8080, function () {
    console.log("Server running at port 8080...");
});

//Endpoint for home
app.get('/home', function (req, res) {

    var view = home.render(req.session.user);
    res.send(view);

});

app.get('/uploadMusic', function (req, res) {

    var view = uploadMusic.render();
    res.send(view);

});

app.post('/upload', function (req, res) {

    uploadMusic.once('d', d => {
        res.send(d);
    });
    uploadMusic.upload(req);

});

app.get('/login', function (req, res) {

    var view = login.renderLogin();
    res.send(view);

});

app.get('/register', function (req, res) {

    var view = login.renderRegister();
    res.send(view);
})

app.post('/login', function (req, res) {

    var input = req.body;
    login.once('loginCheck', d => {
        req.session.user = input.username;
        res.send(d);
    });
    login.login(input.username, input.password);

});

app.post('/register', function (req, res) {

    var input = req.body;
    login.once('registerCheck', d => {
        res.send(d);
    });
    login.register(input.username, input.password);

});

app.get('/logout', function (req, res) {

    delete req.session.user;
    res.send('success');

});