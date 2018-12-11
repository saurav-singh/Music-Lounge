var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('../Modules/session').session;
var sessionConfig = require('../Config/session.json');

//Import and Initialize modules
var Login = require('../Modules/login');
var login = new Login.Login();
var UploadMusic = require('../Modules/uploadMusic');
var uploadMusic = new UploadMusic.UploadMusic();
var home = require('../Modules/home');
var SongController = require('../Modules/songController');
var songController = new SongController.SongController();
var ProfileController = require('../Modules/profileController');
var profileController = new ProfileController.ProfileController();

//Setup and start the server
app.use(express.static("../"));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb', extended: true
}));
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

    if (req.session.user) {
        uploadMusic.once('uploadCheck', d => {
            songController.refresh();
            res.send(d);
        });
        uploadMusic.upload(req, req.session.user);
    }
    else res.send('Restricted');

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

app.get('/discoverMusic', function(req,res){
    
    var list = songController.generateDiscover();
    res.send(list);

});

app.get('/getSongById', function(req,res){

    var id = req.query.id;
    var path = songController.getSongByID(id);
    res.send(path);

});

//gets profile of requested artist
app.get('/getArtistPage', function(req,res) {
	var artist = req.query.artist;
	if(artist == 'Self'){
		artist = req.session.user;
	}
	var data = []
	profileController.once('pageCheck', d => {
		data = d;
		console.log(data);
		if(data[1] == -1){
			res.send(data);
		}
		else {
		profileController.once('personalCheck', d => {
			data.push(d);
			profileController.once('followingCheck', d => {
				data.push(d);
				profileController.once('followerCheck', d => {
					data.push(d);
					profileController.once('slCheck', d => {
						data.push(d);
						res.send(data);
					});
					profileController.populateSongs(artist, songController);
				});
				profileController.populateFollowers(artist);
			});
			profileController.populateFollowing(artist);
		});
		profileController.populatePersonalInfo(artist);
		}
	});
	profileController.renderProfileByName(artist);
});