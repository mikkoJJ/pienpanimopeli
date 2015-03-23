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

    /**
     */
    var Budget = function () {};

    //handles budget
    Budget.prototype.startBudget = function (budget, text) {
        Brew.game.add.tween(text).to({
            number: budget
        }, 2000, Phaser.Easing.Linear.None, true);
     //   budget = budget + money;
        this.update(budget);
    };

    //shows decreases and increases
    Budget.prototype.money = function (money, changeText, budget, text) {
        changeText.setText(money);      
        if (money > 0) changeText.fill = "#106906";
        else changeText.fill = "#EE0A0A";
        Brew.game.time.events.add(2000, function () {
            changeText.setText("");
        }, this);
        
        budget = budget + money;
        Budget.prototype.startBudget(budget, text);
    };


    Budget.prototype.update = function (money) {
        //   console.log(money);
        var percent = money / 1000;
        var message;
        if (percent <= 0) {
            percent = 0;
            Brew.gui.alert("Menetit kaikki rahasi ja hävisit pelin.")
                //            message = "Menetit kaikki rahasi ja hävisit pelin."
        } else if (percent >= 100) {
            percent = 100;
            Brew.gui.alert("Voitit pelin!");
            //            message = "Voitit pelin!";
        } else message = "";

        div.data('percent', percent);
        this.moveProgressBar();
        //     console.log(div.data('percent'));
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