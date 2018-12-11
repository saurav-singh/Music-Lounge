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
	
	renderProfileByName(artist, auth){
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
					if(auth){
					var header = fs.readFileSync('../Views/headerAuth.html', 'utf-8');}
					else{var header = fs.readFileSync('../Views/headerNoAuth.html', 'utf-8');
					}	
					var html = fs.readFileSync('../Views/profileNotFound.html', 'utf8');
					var footer = fs.readFileSync('../Views/footer.html', 'utf-8');
					var artname = -1;
				}
				else {
					if(auth){
					var header = fs.readFileSync('../Views/headerAuth.html', 'utf-8');}
					else{var header = fs.readFileSync('../Views/headerNoAuth.html', 'utf-8');
					}	
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
		console.log(usrID);
		var self = this;
		var q = 'WITH t1 AS (SELECT userID FROM users WHERE username ='+connection.escape(usrID)+')SELECT username FROM subscriptions, users, t1 WHERE subscriptions.subscribed=t1.userID';
		
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
					
		
	populateFollowers(usrID, auth) {
		console.log(usrID);
		var q = 'WITH t1 AS (SELECT userID FROM users WHERE username ='+connection.escape(usrID)+')SELECT username FROM subscriptions, users, t1 WHERE subscriptions.subscribedto=t1.userID';
		var self = this;
		
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
				console.log(rows);
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
	
	followArtist(toFollow, auth){
		var q = 'INSERT INTO subscriptions(subscribed, subscribedto) WITH t1 AS (SELECT userID FROM users WHERE username ='+connection.escape(auth)+'), t2 AS (SELECT userID FROM users WHERE username='+connection.escape(toFollow)+') SELECT t1.userID, t2.userID from t1, t2;';
		var self = this;
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
				self.emit('followCheck', 'ok');
			}
		});
	}
	unfollowArtist(unfollow, auth){
		var q = 'WITH t1 AS (SELECT userID FROM users WHERE username ='+connection.escape(auth)+'), t2 AS (SELECT userID FROM users WHERE username='+connection.escape(unfollow)+') DELETE subscriptions FROM subscriptions INNER JOIN t1 ON subscribed =t1.userID INNER JOIN t2 ON subscribedto=t2.userID;';
		var self = this;
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
				self.emit('unfollowCheck', 'ok');
			}
		});
	}
	
	followStatus(follow, auth) {
		var q = 'WITH t1 AS (SELECT userID FROM users WHERE username ='+connection.escape(auth)+'), t2 AS (SELECT userID FROM users WHERE username='+connection.escape(follow)+') SELECT * FROM subscriptions, t1, t2 WHERE subscribed =t1.userID AND subscribedto=t2.userID;';
		var self = this;
		connection.query(q, function (err, rows, fields) {
			if (err) {
				console.log('Error' + err);
				return err;
			}
			else {
				if(rows.length == 0) {
					// we have not followed this artist
					self.emit('fStatus', 'notFollowed');
				}
				else {
					self.emit('fStatus', 'followed');
				}
			}
		});
	}
}
	
exports.ProfileController = ProfileController;

