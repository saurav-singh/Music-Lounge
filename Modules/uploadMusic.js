'use strict'
var formidable = require('formidable');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

class UploadMusic extends EventEmitter {

    constructor() {
        super();
    }

    render() {

        var header = fs.readFileSync('../Views/headerAuth.html');
        var body = fs.readFileSync('../Views/upload.html');

        return (header + body);
    }

    upload(f, user) {

        var self = this;
        var form = new formidable.IncomingForm();

        var newpath = '../Assets/MusicLibrary/' + user;

        if (!fs.existsSync(newpath))
            fs.mkdirSync(newpath);

        form.parse(f, function (err, fields, files) {
            var oldpath = files.upload.path;
            newpath += '/' + files.upload.name;

            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log(err);
                    self.emit('uploadCheck', "fail");
                }
                self.emit('uploadCheck', "success");
            });
        });

    }
}

exports.UploadMusic = UploadMusic;