(function () {

    var settings = {
        //the div under which windows are placed:
        dom: '#progressbar',


        progressStyle: {
            width: '100%',
            height: '25px'
        },

        wrapStyle: {
            background: '#f80',
            margin: '10px',
            overflow: 'hidden',
            position: 'relative'
        },

        barStyle: {
            background: '#ddd',
            left: '0',
            position: 'absolute',
            top: '0'
        }

    };

    var div;
    var bar;
    var full = 100000;
    var tween;

    /**
     */
    var Budget = function () {};

    //handles budget
    Budget.prototype.startBudget = function (budget, text) {
        //   if (budget < 0 || budget > 100000) return;
        this.tween = Brew.game.add.tween(text).to({
            number: budget
        }, 1000, Phaser.Easing.Linear.None, true);
        this.update(budget);
    };

    Budget.prototype.update = function (money) {
        var percent = money / 1000;
        var message;
        if (percent <= 0) {
            percent = 0;
            this.tween.stop();
        } else if (percent >= 100) {
            percent = 100;
            this.tween.stop()
        } else message = "";

        div.data('percent', percent);
        this.moveProgressBar();
        return message;

    };

    Budget.prototype.moveProgressBar = function () {
        var getPercent = div.data('percent') / 100;
        var getProgressWrapWidth = div.width();
        var progressTotal = getPercent * getProgressWrapWidth;
        var animationLength = 250;

        // on page load, animate percentage bar to data percentage length
        // .stop() used to prevent animation queueing
        bar.stop().animate({
            left: progressTotal
        }, animationLength);
    };

    /**
     */
    Budget.prototype.create = function () {
        bar = $('<div>').css(settings.progressStyle).css(settings.barStyle);
        div = $('<div>')
            .css(settings.progressStyle)
            .css(settings.wrapStyle)
            .data('percent', 100)
            .append(bar)
            .appendTo(settings.dom);
    };

    //   Brew.Budget = Budget;
    Brew.Budget = new Budget();
})();