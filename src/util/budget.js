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

    var money = 100;
    var div;
    var bar;

    /**
     */
    var Budget = function () {};
    
    Budget.prototype.update = function (percent) {
        div.data('percent', percent);
        this.moveProgressBar();
        console.log(div.data('percent'));
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