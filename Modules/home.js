'use strict'
var fs = require('fs');

function render(user) {
    
    //Render non-authenticated homepage
    if (!user) {

        var header = fs.readFileSync('../Views/headerNoAuth.html', 'utf-8');
        var body = fs.readFileSync('../Views/discover.html', 'utf-8');
        var footer = fs.readFileSync('../Views/footer.html', 'utf-8');

        //return header+footer;
        return (header + body + footer);
    }
    //Render authenticated homepage
    else {

        var header = fs.readFileSync('../Views/headerAuth.html', 'utf-8');
        var body = fs.readFileSync('../Views/discover.html', 'utf-8');
        var footer = fs.readFileSync('../Views/footer.html', 'utf-8');

        //return header+footer;
        return (header + body + footer);
    }

}

exports.render = render;