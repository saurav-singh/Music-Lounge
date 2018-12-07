'use strict'
var fs = require('fs');

class Login {

    constructor() {

    }

    render() {

        var header = fs.readFileSync('../Views/headerNoAuth.html');
        var body = fs.readFileSync('../Views/login.html');
        var footer = fs.readFileSync('../Views/footer.html');

        return (header + body + footer);
    }
}

exports.Login = Login;