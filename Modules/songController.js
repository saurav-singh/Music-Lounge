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
        var id = 1;

        userFiles.forEach((d, i) => {
            //Create json array for every user
            self.userSong.push({ [d]: [] });
            //Read all song directory
            var path = this.songPath + '/' + d;
            var songs = fs.readdirSync(path);
            //Insert song into their respective user's array
            songs.forEach(s => {
                //Remove .mp3
                s = s.slice(0, s.length - 4);
                self.userSong[i][d].push(s)
                self.songList.push({ [d]: s + id });
                id++;
            });
        });

    }

    getAllMusic() {
        //Return entire json array
        return this.userSong;
    }

    getSongByUser(user) {

        var list = [];
        //Return array of songs by the user
        this.userSong.forEach((d) => {
            var usr = Object.keys(d)[0];
			console.log(usr);
			console.log(d);
            if (user == usr) {
                list = d[user];
            }
        });

        return list;
    }

    getSongByID(id) {

        var path = null;

        for (var i in this.songList) {
            var user = Object.keys(this.songList[i]);
            var song = this.songList[i][user];
            var id2 = song[song.length - 1];
            if (id == id2) {
                song = song.slice(0, song.length - 1) + '.mp3';
                path = this.songPath + '/' + user + '/' + song;
            }
        }

        return path;
    }
    generateDiscover() {

        if (this.songList.length < 10)
            return this.songList;
        else {
            var list = [];

            while (list.length < 10) {
                var r = Math.floor(Math.random() * this.songList.length);
                if (!list.includes(r)) list.push(r);
            }

            list = list.map(d => this.songList[d]);

            return list;
        }
    }

    refresh() {
        this.userSong = [];
        this.songList = [];
        this.populate();
    }

}

exports.SongController = SongController;

