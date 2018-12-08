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
        console.log(d.code);
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