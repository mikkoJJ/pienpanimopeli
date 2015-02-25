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
        budget = 50,
        money,
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

            this.isoGroup = this.add.group();
            this.__makeFloor();

            this.cursorPosition =
                this.cursor = this.add.isoSprite(0, 0, 0, 'cursor', 0, this.isoGroup);
            //this.cursor.anchor.setTo(0.5);

            letter = this.add.sprite(this.width, this.height, 'letter');
            letter.scale.set(0.2, 0.2);
            letter.anchor.setTo(0, 0);
            //   letter.anchor.set(0.5);
            //  letter.events.onInputDown.add(this.listener, this);

            letter.inputEnabled = true;
            letter.input.start();
            letter.events.onInputDown.add(this.cook, this);

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

            lager = this.beer;
            lager.name = "olut"
            lager.amount = 50;

            bottle = this.add.sprite(100, 100, 'sell');
            bottle.inputEnabled = true;
            bottle.input.enableDrag(false, true);
            bottle.events.onInputDown.add(this.sell, this);

            //      this.beer.name = "lager";
            //        this.beer.amount = 20;
            bottle.beer = this.beer;

            var kettle = this.add.sprite(150, 150, 'cook');
            kettle.inputEnabled = true;
            kettle.input.enableDrag(false, true);
            kettle.events.onInputDown.add(this.cook, this);

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50);

        },

        //budjetin hallinnointia
        sell: function () {
            Brew.Budget.update(budget + 10);
            budget = budget + 10;
            bottle.beer.sell(10);
            if (budget + 10 == 100) Brew.gui.alert("voitit pelin!" + bottle.beer.amount);

        },

        //budjetin hallinnointia
        cook: function () {
            Brew.Budget.update(budget - 10);
            budget = budget - 10;
            bottle.beer.cook(10)
            if (budget - 10 == 0) Brew.gui.alert("hävisit pelin!" + bottle.beer.amount);

        },

        /*
         * sekuntimittari
         */
        updateCounter: function () {
            counter++;

            //   console.log(counter);
            if (counter < 5) {
                scoreText.setText(counter);
            } else {
                output = this.messages.getMessage();

                var list = [];
                list[i] = this.messages.getMessage();
                i++;
                if (list.length > 1) {
                    //    budget = budget - 500;
                    //    this.moveProgressBar(100);
                    //       Brew.gui.alert("Sait sakot! " + sakot, function () {}, this);
                    //      timer.pause();
                }
                //    console.log(list.length);
                counter = 0;
            }
        },

        update: function () {
            if (letter.input.pointerDown(this.game.input.activePointer.id)) {

                //            Brew.gui.alert("klikkasit kirjettä");
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