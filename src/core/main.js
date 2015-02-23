(function () {

    var settings = {
        tileSize: 38
    };

    //helper variables:
    var letter,
        scoreText,
        output,
        timer,
        counter = 0,
        sakot, i = 0,
        budget,
        bottle;


    /**
     * This is the main game state that starts when all assets are loaded.
     *
     * @class Brew.Main
     * @constructor
     */
    Brew.Main = function () {
        return;
    };

    Brew.Main.prototype = {

        create: function () {

            this.messages = new Brew.Messages();
            this.beer = new Brew.Beer();
            //   this.storage = new Brew.Storage();

            this.isoGroup = this.add.group();
            this.__makeFloor();

            this.cursorPosition =
                this.cursor = this.add.isoSprite(0, 0, 0, 'cursor', 0, this.isoGroup);
            //this.cursor.anchor.setTo(0.5);

            letter = this.add.sprite(this.width, this.height, 'letter');
            letter.scale.set(0.2, 0.2);
            letter.anchor.setTo(0, 0);
            //   letter.anchor.set(0.5);
            letter.inputEnabled = true;
            //  letter.events.onInputDown.add(this.listener, this);

            letter.inputEnabled = true;
            letter.input.start();

            //aputeksti kehitysvaiheelle
            scoreText = this.add.text(
                this.world.centerX + 300,
                this.world.height / 5, "", {
                    size: "32px",
                    fill: "#FFF",
                    align: "center"
                }

            );
            scoreText.anchor.set(0.5);
            scoreText.setText("Seconds");

            this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

            // on page load...
            budget = 1000;
            this.moveProgressBar(1000);

            lager = this.beer;
            lager.name = "olut"
            lager.amount = 50;

            bottle = this.add.sprite(100, 100, 'testObject');
            bottle.inputEnabled = true;
            bottle.input.enableDrag(false, true);
      //      bottle.events.onInputDown.add(this.sell, {
    //            param1: lager
    //        }, this);

            //      this.beer.name = "lager";
            //        this.beer.amount = 20;
            //        bottle.beer = this.beer;


        },

     /*   sell: function (lager) {
            lager.sell(this, 10);
        },
*/

        // SIGNATURE PROGRESS
        moveProgressBar: function (jako) {
            //    console.log("moveProgressBar");
            var getPercent = ($('.progress-wrap').data('progress-percent') / 500);
            //jaettuna sadalla = noin puolet
            var getProgressWrapWidth = $('.progress-wrap').width();
            var progressTotal = getPercent * getProgressWrapWidth;
            var animationLength = 250;

            // on page load, animate percentage bar to data percentage length
            // .stop() used to prevent animation queueing
            $('.progress-bar').stop().animate({
                left: progressTotal
            }, animationLength);
        },

        /*
         * sekuntimittari
         */
        updateCounter: function () {
            counter++;
            this.moveProgressBar(counter * 1000);

            //   console.log(counter);
            if (counter < 5) {
                scoreText.setText(counter);
            } else {

                //    var tilaus = game.cache.getJSON('texts.json', function (data) {
                //        output = data.order[Math.floor(Math.random() * data.order.length)].content;
                //    });
                output = this.messages.getMessage();
                //        output = this.beer.getBeer();
                //    Brew.gui.newOrder(output)
                //        budget = budget + 500;
                //        this.moveProgressBar(counter);

                var list = [];
                list[i] = this.messages.getMessage();
                i++;
                if (list.length > 1) {
                    //    budget = budget - 500;
                    this.moveProgressBar(100);
                    //       Brew.gui.alert("Sait sakot! " + sakot, function () {}, this);
                    //      timer.pause();
                }
                //    console.log(list.length);
                counter = 0;
            }
        },

        update: function () {
            //this.moveProgressBar(counter*100); //sidottu toistaiseksi sekunteihin

            // on browser resize...
            //    $(window).resize(function() {
            //        this.moveProgressBar(1);
            //    });

            if (letter.input.pointerDown(this.game.input.activePointer.id)) {
                Brew.gui.alert("klikkasit kirjettä");
            }

            if (bottle.input.pointerDown(this.game.input.activePointer.id)) {
               //ei toimi, koska dragattaessa pointer on down koko ajan eli sell ehtii tapahtua useamman kerran ennen kuin irrotetaan ote 
            //    this.beer.getBeer();
             //   bottle.beer.sell(5);
            //    bottle.beer.cook(10)
                lager.sell(25);
                Brew.gui.alert(lager.amount);
            }

            this.messages.update();

            //check mouse position and put the cursor on the correct place:
            var _pos = new Phaser.Plugin.Isometric.Point3();
            this.game.iso.unproject(this.game.input.activePointer.position, _pos);

            this.isoGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(_pos.x, _pos.y);
                if (inBounds) {
                    this.cursor.isoX = tile.isoX;
                    this.cursor.isoY = tile.isoY;
                }

            }, this);
        },


        /**
         * Creates the ground of play area.
         *
         * @private
         */
        __makeFloor: function () {
            var tile;
            for (var xx = 0; xx < 15 * settings.tileSize; xx += settings.tileSize) {
                for (var yy = 0; yy < 15 * settings.tileSize; yy += settings.tileSize) {
                    tile = this.add.isoSprite(xx, yy, 0, 'floor', 0, this.isoGroup);
                }
            }
        }
    };

})();