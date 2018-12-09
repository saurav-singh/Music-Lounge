//Global variables
var loginPage = true;

$(document).ready(function () {

    //Initial render
    render('/home');

});

function render(path) {

    $.ajax({
        type: 'GET',
        url: path
    }).then(d => {
        $("#content").html(d);
        discoverMusic();
    });



}

function discoverMusic() {
    $.ajax({
        type: 'GET',
        url: '\discoverMusic'
    }).then(data => {

        var list = "<ul>";

        data.forEach(d => {
            var user = Object.keys(d)[0];
            var song = d[user];
            list += "<li>" + song + "by - " + user + "<button>play</button></li>";
        });

        list += "</ul>";

        $("#songList").html(list);
    });
}

function authPage() {

    if (loginPage)
        render('/login');
    else
        render('/register')
}

function switchAuth() {

    loginPage = !loginPage;
    authPage();
}

function login() {

    var username = $("#username").val();
    var password = hash($("#password").val());

    input = { username: username, password: password };

    $.ajax({
        type: 'POST', url: '/login', data: input
    }).then(d => {
        //if successful d = true else false
        if (d)
            render('/home');
        else
            alert('Invalid username or passwor');
    });

}

function register() {
    var username = $("#username").val();
    var password = hash($("#password").val());

    input = { username: username, password: password };

    $.ajax({
        type: 'POST', url: '/register', data: input
    }).then(d => {

        if (d.code == 'ER_DUP_ENTRY')
            alert('Username already exists, please enter a different username.');
        else if (d) {
            alert('User successfully registered');
            loginPage = true;
            render('/login');
        }
        else
            alert('Oops.. something went wrong!');
    });

}

function logout() {

    $.ajax({ type: 'GET', url: '/logout' }).then(d => {
        if (d == 'success')
            render('/home');
        else
            alert('Oops.. something went wrong!');
    });

}

function uploadMusic() {
    render('/uploadMusic');
}

function upload() {
    $('#musicForm').submit();
}