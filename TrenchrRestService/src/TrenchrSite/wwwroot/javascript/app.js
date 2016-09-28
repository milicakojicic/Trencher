/// <reference path="oidc-client.js" />

function log() {

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        console.log(msg);
    });
}


var config = {
    authority: "http://localhost:9300",
    client_id: "js",
    redirect_uri: "http://localhost:4033/callback.html",
    response_type: "id_token token",
    scope:"openid profile api1",
    post_logout_redirect_uri: "http://localhost:4033/default.html"
};
var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

//function api() {
//    mgr.getUser().then(function (user) {
//        var url = "http://localhost:12345";

//        var xhr = new XMLHttpRequest();
//        xhr.open("GET", url);
//        xhr.onload = function () {
//            log(xhr.status, JSON.parse(xhr.responseText));
//        }
//        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
//        xhr.send();
//    });
//}

function logout() {
    mgr.signoutRedirect();
}