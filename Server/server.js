var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Login = require('../Modules/login');
var login = new Login.Login();

var UploadMusic = require('../Modules/uploadMusic');
var uploadMusic = new UploadMusic.UploadMusic();

var home = require('../Modules/home');

//Setup and start the server
app.use(express.static("../"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(8080, function () {
    console.log("Server running at port 8080...");
});

//Endpoint for home
app.get('/home', function (req, res) {

    var view = home.render();
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

    var view = login.render();
    res.send(view);
    
}); 