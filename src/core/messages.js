(function () {

    var Messages = function () {};

    var sakot;

    Messages.prototype = {

        update: function () {
            //  alert(Brew.game.time.elapsed);
        },

        getMessage: function () {
            var data = Brew.game.cache.getJSON('texts');
            sakot = data.letters[0].content;
            return sakot;
        }
    };

    Brew.Messages = Messages;
})();