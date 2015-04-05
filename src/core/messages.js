(function () {

    var Messages = function () {};
   
    /*
    Viestityypit: tutoriaali & mainos
    */

    Messages.prototype = {

        update: function () {
            //  alert(Brew.game.time.elapsed);
        },

        //returns random advertise option
        getMessage: function () {
            var data = Brew.game.cache.getJSON('texts');
            
            var message = data.ads[Math.floor(Math.random()*data.ads.length)]; //title content due duetext
            return message;
        }
    };

    Brew.Messages = Messages;
})();