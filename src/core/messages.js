(function () {

    var Messages = function () {
    };
    
    var sakot;

    Messages.prototype = {

        update: function () {
          //  alert(Brew.game.time.elapsed);
        },

        getMessage: function () {
        //    game.cache.getJSON('texts.json', function (data) {
        //        sakot = data.letters[0].content;
        //    });
            return "moi";
        }
    };   

    Brew.Messages = Messages;
})();