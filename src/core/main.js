(function () {

    var settings = {
        tileSize: 38
    };

    //helper variables:
    var letter,
        scoreText,
        output,
        counter = 0,
        sakot, i = 0,
        budget = 50,
        money,
        sale,
        kettle,
        bottle,
        storage;


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

            storage = this.add.group();

            this.cursorPosition =
                this.cursor = this.add.isoSprite(0, 0, 0, 'cursor', 0, this.isoGroup);
            //this.cursor.anchor.setTo(0.5);

            letter = this.add.button(this.width, this.height, 'letter', function() {
                Brew.gui.toggleMessages();
            }, this);
            letter.scale.set(0.2, 0.2);
            letter.anchor.setTo(0, 0);
            //   letter.anchor.set(0.5);
            //  letter.events.onInputDown.add(this.listener, this);

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
            scoreText.setText("Beer in storage: ");

            this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

            lager = this.beer;
            lager.name = "lager"
            lager.amount = 50;

            sale = this.add.isoSprite(150, 100, 0, 'sell');
            sale.inputEnabled = true;
            sale.events.onInputDown.add(this.sell, this);
            sale.beer = this.beer;
            
            kettle = new Kettle(this.game, 250, 100, 0);

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50);

            bottle = this.add.isoSprite(0, 0, 0, 'bottle');
      //      pullo.body.moves = true;'
            bottle.moves = true;
            //ei toimi kummatkaan
            bottle.inputEnabled = true;
            bottle.input.enableDrag(false, true);
            storage.add(bottle);

            Brew.gui.addMessage('Tilaus', '3 tynnyriä tummaa olutta.');
            Brew.gui.addMessage('Tilaus', '3 tynnyriä lageria.');
            Brew.gui.addMessage('Sakko', 'Myit liikaa olutta!');
            Brew.gui.addMessage('Viesti', 'Haluan ostaa olutta! t: Nalle');
        },
        

        //selling beer
        sell: function () {
            if (storage.length <= 0) return;
            else {
                var message = Brew.Budget.update(budget + 10);
                budget = budget + 10;
                sale.beer.sell(10);
                if (budget >= 100) {
                    Brew.gui.alert("Liikevoittosi on ilmiömäinen. " + message);
              //      sale.inputEnabled = false;
                }
                storage.getFirstExists(true).destroy();
            }

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
            scoreText.setText("Beer in storage: " + this.beer.amount + " litres")

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

    
    var Kettle = function(game, x, y, z) {
        //call super constructor
        Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'cook');
        
        this.inputEnabled = true;
        this.events.onInputDown.add(this.cook, this);
        
        game.add.existing(this);
    };
    
    Kettle.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Kettle.prototype.constructor = Kettle;
    
    //cook some beer in the kettle
    Kettle.prototype.cook = function () {
        if (storage.length >= 15) {   
            budget = budget - 50;
            var message = Brew.Budget.update(budget);
            Brew.gui.alert("Ylitit vuosittaisen tuotantokiintiösi ja sait sakot! " + message);
        } else {
            budget = budget - 1;
            var message = Brew.Budget.update(budget);
            sale.beer.cook(10)
            if (budget <= 0) {
            //    Brew.gui.alert("hävisit pelin!" + bottle.beer.amount);
                this.inputEnabled = false;
                Brew.gui.alert(message)
            }
            var b = this.game.add.isoSprite(0, this.game.rnd.integerInRange(0, 500), 0, 'bottle');
            b.inputEnabled = true;
            b.input.enableDrag(false, true);
            storage.add(b);
        }
    };
    
    Brew.Kettle = Kettle;
    
})();