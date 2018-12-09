'use strict'

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

class SongController extends EventEmitter {


    constructor() {
        super();
        this.songPath = '../Assets/MusicLibrary';
        this.userSong = [];
        this.songList = [];
        this.populate();
    }

    populate() {
        var self = this;
        var userFiles = fs.readdirSync(this.songPath);

        userFiles.forEach((d, i) => {
            //Create json array for every user
            self.userSong.push({ [d]: [] });
            //Read all song directory
            var path = this.songPath + '/' + d;
            var songs = fs.readdirSync(path);
            //Insert song into their respective user's array
            songs.forEach(s => {
                self.userSong[i][d].push(s)
                self.songList.push({ [d]: s });
            });

        });

        this.generateDiscover();

    }

    getAllMusic() {
        //Return entire json array
        return this.userSong;
    }

    getMusicOf(user) {

        //Return array of songs by the user
        this.userSong.forEach((d) => {
            var usr = Object.keys(d)[0];
            if (user == usr) {
                return (d[user]);
            }
        });
        //Return null if not found
        return null;
    }

    generateDiscover() {

        if (this.songList.length < 10)
            return this.songList;
        else {
            var list = [];
            for (var i = 0; i < 10; i++)
                list.push(Math.floor(Math.random() * this.userSong.length));
            list = list.map(d => this.songList[d]);
            return list;
        }

    }


}

exports.SongController = SongController;

