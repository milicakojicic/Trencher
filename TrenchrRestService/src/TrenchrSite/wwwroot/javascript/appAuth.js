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

var user;
var logedInUserID;

mgr.getUser().then(function (u) {
    if (u) {
        log("User logged in", u.profile);
        user = u;
        logedInUserID = u.profile.sub;
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

function logout() {
    mgr.signoutRedirect();
}