window.fbAsyncInit = function () {
    FB.init({
        appId: '349671038558260',
        frictionlessRequests: true,
        xfbml: true, // Will stop the fb like button from rendering automatically
        status: true,
        version: 'v2.3'
    });
 /*   FB.ui({ //aiheuttaa jostain syystä heti reloadatessa
        method: 'share',
        href: 'localhost:8080/pienpanimopeli/assets/sprites/single_sprites/bottle.png' //The absolute URL of the page that will be liked.
    }, function (response) {});*/
};

//load and initialize sdk
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/fi_FI/sdk.js"; //kielivalinta
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));