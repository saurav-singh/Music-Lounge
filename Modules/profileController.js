'use strict'

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var SongController = require('../Modules/songController');
var dbconfig = require('../Config/database.json');

//Create and connect to mysql database
var connection = mysql.createConnection(dbconfig);
connection.connect(function (err) {
    if (err)
        console.log("Error connecting to database..." + err);
    else
        console.log("Successfully connected to database..");
})

//create a dom parser

class ProfileController extends EventEmitter {

    constructor() {
        super();
        this.ProfilePath = '../Assets/profile.html';
    }
	
	renderProfileByName(artist){
		// get the artist profile and all 
		var q = 'SELECT * FROM users WHERE username ='+connection.escape(artist); 
		var self = this;
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
				if(rows.length == 0) {
					//there is no user
				
					var header = fs.readFileSync('../Views/headerAuth.html', 'utf-8');
					var html = fs.readFileSync('../Views/profileNotFound.html', 'utf8');
					var footer = fs.readFileSync('../Views/footer.html', 'utf-8');
					var artname = -1;
				}
				else {
					var header = fs.readFileSync('../Views/headerAuth.html', 'utf-8');
					var html = fs.readFileSync('../Views/profile.html', 'utf8');
					var footer = fs.readFileSync('../Views/footer.html', 'utf-8');
					var artname = rows[0].username;
				}
				self.emit('pageCheck', [header+html+footer, artname]);
			}
		});
	}
		
	
		
	populatePersonalInfo(usrID) {
		var q = 'SELECT * FROM userinfo, users WHERE users.username ='+connection.escape(usrID)+'AND userinfo.userID = users.userID'; 
		var self = this;
		
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
				
				var usr = rows[0];
				var profStr = '<img width="178px" height="180px" id=profilePicture src=../Assets/Images/'+usr.profilePictureLocation+'><br>';
				profStr = profStr + "<table data-role='table' class='ui-responsive' <tbody>";
				profStr = profStr + "<tr><td>Genre</td><td>"+usr.genre+"</td></tr><tr><td>origin</td><td>"+usr.originCity+"</td></tr><tr><td>Active Since</td><td>"+usr.activeSince+"</td></tr>";
				profStr = profStr + "</tbody></table>";
				self.emit('personalCheck',profStr);
			}
		});
	}
	populateFollowing(usrID) {
		var q = 'SELECT subscribedto FROM subscriptions, users WHERE subscribed = users.userID AND users.username ='+connection.escape(usrID); 
		var self = this;
		
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
		
				var followStr = "<table data-role='table' class='ui-responsive' <tbody><tr>";
				for(var i=0; i<rows.length; i++){
					if(i%4==0 && i != 0) {
						followStr = followStr +'</tr><tr><td>'+rows[i].username+'</td>';
					}
					else{
						followStr = followStr + '<td>'+rows[i].username+'</td>';
					}
				}
				followStr = followStr + '</tr></tbody></table>';
				self.emit('followingCheck',followStr);
			}
		});
	}
					
		
	populateFollowers(usrID) {
		var q = 'SELECT subscribedto FROM subscriptions, users WHERE subscribedto = users.userID AND users.username ='+connection.escape(usrID); 
		var self = this;
		
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
		
				var followStr = "<table data-role='table' class='ui-responsive' <tbody><tr>";
				for(var i=0; i<rows.length; i++){
					if(i%4==0 && i != 0) {
						followStr = followStr +'</tr><tr><td>'+rows[i].username+'</td>';
					}
					else{
						followStr = followStr + '<td>'+rows[i].username+'</td>';
					}
				}
				followStr = followStr + '</tr></tbody></table>';
				self.emit('followerCheck',followStr);
			}
		});
	}
	
	populateSongs(usrID, sc){
		var sl = sc.getSongByUser(usrID);
		this.emit('slCheck', sl);
	}
}
	
exports.ProfileController = ProfileController;

