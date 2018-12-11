'use strict'
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var dbconfig = require('../Config/database.json');

//Create and connect to mysql database
var connection = mysql.createConnection(dbconfig);
connection.connect(function (err) {
    if (err)
        console.log("Error connecting to database..." + err);
    else
        console.log("Successfully connected to database..");
})

class Login extends EventEmitter {
    constructor() {
        super();
    }

    renderLogin() {

        var header = fs.readFileSync('../Views/headerNoAuth.html');
        var body = fs.readFileSync('../Views/login.html');
        var footer = fs.readFileSync('../Views/footer.html');

        return (header + body + footer);
    }

    renderRegister() {

        var header = fs.readFileSync('../Views/headerNoAuth.html');
        var body = fs.readFileSync('../Views/register.html');
        var footer = fs.readFileSync('../Views/footer.html');

        return (header + body + footer);
    }



    register(username, password, genre, originCity, activeSince) {
        var profilePictureLocation = "DefaultProfile.PNG";

        console.log(username, + " " + password + " " + profilePictureLocation + " " + genre + " " + originCity + " " + activeSince);
       
      //  var q = 'insert into users (username, password) values (' + connection.escape(username) + ',' + connection.escape(password) + ')';
      var q = 'insert into userTable (username, password, profilePictureLocation, genre, originCity, activeSince) values (' + connection.escape(username) + ',' + connection.escape(password) + ',' + connection.escape(profilePictureLocation) + ',' + connection.escape(genre) + ',' + connection.escape(originCity) + ',' + connection.escape(activeSince) + ')';
         var self = this;

        connection.query(q, function (err, result) {
            if (err) {
                console.log('Error' + err);
                self.emit('registerCheck', err);
            }
            else {
                self.emit('registerCheck', true);
                //self.register_remaining(username, genre, originCity, activeSince);
            }
        });

    }

    //register the remaining data to the uerinfo table
    register_remaining(username, genre, originCity, activeSince) {

        var userID = this.getUserID(username);
        var profilePictureLocation = "";
        console.log("userId : " + userID);

        var q = 'insert into userinfo (userID, profilePictureLocation, genre, originCity, activeSince) values (' +
            connection.escape(userID) + ',' + connection.escape(profilePictureLocation) + ',' + connection.escape(genre) + ',' + connection.escape(originCity) + ',' + connection.escape(activeSince) + ')';


        var self = this;
        connection.query(q, function (err, result) {
            if (err) {
                console.log('Error' + err);
                self.emit('registerCheck', err);
            }
            else{
                self.emit('registerCheck', true);
                console.log("Registered!!")
            }
           
        });
    }

    //Get the userID for the username
    getUserID(username) {

        var sql = "select userID from users where username = " + connection.escape(username);
        connection.query(sql,
            function (err, rows, fields) {
                if (err) {
                    console.log("Error during querying process");
                } else {
                    //console.log("Result : ", rows[0].userID);
                    return rows[0].userID;
                }
            });
    }
    login(username, password) {

        var q = 'select * from userTable where username=' + connection.escape(username) + ' and password=' + connection.escape(password);
        var self = this;
        connection.query(q, function (err, rows, fields) {
            if (err) {
                console.log('Error: ' + err);
                return false;
            }
            else {
                if (rows.length > 0)
                    self.emit('loginCheck', true);
                else
                    self.emit('loginCheck', false);
            }
        });
    }

}

exports.Login = Login;