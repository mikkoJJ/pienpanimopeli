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
        storage,
        lager
        ;

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

            this.isoGroup = this.add.group();
            this.__makeFloor();

            storage = new Brew.Storage(this.game);
            storage.base.x = 2 * settings.tileSize;
            storage.base.y = 2 * settings.tileSize;
            storage.amount = 10;

            this.cursorPosition = 
                this.cursor = this.add.isoSprite(0, 0, 0, 'cursor', 0, this.isoGroup);
            //this.cursor.anchor.setTo(0.5);

            letter = this.add.button(this.width, this.height, 'letter', function () {
                Brew.gui.toggleMessages();
            }, this);
            letter.scale.set(0.2, 0.2);
            letter.anchor.setTo(0, 0);
            //   letter.anchor.set(0.5);
            //  letter.events.onInputDown.add(this.listener, this);

            //aputeksti kehitysvaiheelle
            /*scoreText = this.add.text(
                this.world.centerX + 300,
                this.world.height / 5, "", {
                    size: "32px",
                    fill: "#FFF",
                    align: "center"
                }
            );
            scoreText.anchor.set(0.5);
            scoreText.setText("Beer in storage: ");*/

            this.time.events.loop(Phaser.Timer.SECOND * 5, this.updateCounter, this);
            kettle = new Kettle(this.game, 250, 100, 0);

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50);

            //tilaukset debuggausta varten
            var iso = new Order("lageria", 200, "Kesko");
            var pieni = new Order("lageria", 1, "Hemingways");
            var laiton = new Order("lageria", 1, "Nalle");

            Brew.gui.addMessage('Tilaus', iso.message(), iso, "Myy", this.sell);
            Brew.gui.addMessage('Tilaus', laiton.message(), laiton, "Myy", this.sell);
            Brew.gui.addMessage('Tilaus', pieni.message(), pieni, "Myy", this.sell);
            //    Brew.gui.addMessage('Tilaus', '3 tynnyriä lageria.');
            //    Brew.gui.addMessage('Sakko', 'Myit liikaa olutta!');
            //    Brew.gui.addMessage('Viesti', 'Haluan ostaa olutta! t: Nalle');
        },

        //selling beer
        sell: function (order) {
            if (storage.amount < order.amount) return false;
            else if (order.buyer == "Nalle") {
                Brew.gui.alert("Yksityishenkilölle myyminen on laitonta! Sait sakot.");
                budget = budget - 10;
                Brew.Budget.update(budget);
            } else {
                budget = budget + order.price * order.amount;
                var message = Brew.Budget.update(budget);
                storage.amount -= order.amount;
                if (budget >= 100) {
                    Brew.gui.alert("Liikevoittosi on ilmiömäinen. " + message);
                    kettle.inputEnabled = false;
                }
            }

        },

        /*
         * control orders
         */
        updateCounter: function () {
            //   console.log(this.time.totalElapsedSeconds());
            //   if (i > 5) return;
            var order = new Order().random();
            var list = [];
            list[i++] = Brew.gui.addMessage('Tilaus', order.message(), order, "Myy", this.sell);

            var now = this.time.totalElapsedSeconds();
            if (now - order.age > 10) {
                //poista tilaus
            }
        },

        update: function () {
       //     scoreText.setText("Olutta: " + this.beer.amount + " koria")

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



    /**
     * Kettle IsoSprite that handles the cooking of beer.
     *
     * @class Kettle
     * @augments Phaser.Plugin.Isometric.IsoSprite
     * @param {Phaser.Game} game reference to the currently used game object
     * @param {Number}      x    iso X position
     * @param {Number}      y    iso X position
     * @param {Number}      z    iso X position
     */
    var Kettle = function (game, x, y, z) {
        //call super constructor
        Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'kettle');

        this.inputEnabled = true;
        this.events.onInputDown.add(this.check, this);

        game.add.existing(this);
    };

    Kettle.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Kettle.prototype.constructor = Kettle;


    //check if there is enoug money for cook
    Kettle.prototype.check = function () {
        if (budget - 1 <= 0) {
            Brew.gui.alert("Rahasi eivät riitä uuden erän valmistamiseen.");
        } else {
            budget = budget - 1;
            var message = Brew.Budget.update(budget);
            this.inputEnabled = false;
            //scoreText.setText("Cooking...");
            Brew.game.time.events.add(Phaser.Timer.SECOND * 4, this.cook, this);
            Brew.game.add.tween(this).to({isoZ: this.isoZ + 2}, Phaser.Timer.SECOND/8, Phaser.Easing.Default, true, 0, 16, true);
        }

    };

    //cook some beer in the kettle
    Kettle.prototype.cook = function () {
        storage.amount += 10;
        //scoreText.setText("Olutta: " + storage.amount + " pulloa");
        this.inputEnabled = true;

        if (storage.amount >= 50) {
            budget = budget - 30;
            var message = Brew.Budget.update(budget);
            Brew.gui.alert("Ylitit vuosittaisen tuotantokiintiösi ja sait sakot! " + message);
        }
    };

    Brew.Kettle = Kettle;

    var Order = function (type, amount, buyer) {
        //    this.age = age;
        this.type = type;
        this.amount = amount;
        this.price = 2;
        this.buyer = buyer;
    };

    Order.prototype.random = function () {
        var types = ["lageria", "tummaa olutta", "portteria"];
        var buyers = ["Kesko", "Hemingways", "Nalle"];

        return new Order(
            types[Brew.game.rnd.integerInRange(0, types.length - 1)],
            Brew.game.rnd.integerInRange(1, 10),
            //     Brew.game.time.totalElapsedSeconds(), 
            buyers[Brew.game.rnd.integerInRange(0, buyers.length - 1)])
    };

    Order.prototype.message = function () {
        return this.amount + " tynnyriä " + this.type + " Tilaaja:" + this.buyer;
    }

    Brew.Order = Order;

})();