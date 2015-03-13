(function () {

    var settings = {
        tileSize: 38
    };

    //helper variables:
    var letter,
        i = 0,
        budget = 50000,
        kettle,
        kettle2,
        storage,
        person,
        person2,
        floor;

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
            this.game.iso.anchor.setTo(0.5, 0.2);
            this.messages = new Brew.Messages();

            this.isoGroup = this.add.group();
            this.__makeFloor();

            storage = new Brew.Storage(this.game, this.isoGroup);
            storage.base.x = 0 * settings.tileSize;
            storage.base.y = 1 * settings.tileSize;
            storage.amount = 10;

            /*    var kattila = this.add.isoSprite(50, 200, 0, 'kattila');
            kattila.scale.set(0.5, 0.5);

            var paakattila = this.add.isoSprite(50, 0, 0, 'paa_kattila_luonnos');
            paakattila.scale.set(0.5, 0.5);
*/
            this.cursor = this.add.isoSprite(0, 0, 0, 'sprites', 'select', this.isoGroup);
            this.cursor.anchor.setTo(0.5, 0);

            letter = this.add.button(50, 5, 'sprites', function () {
                Brew.gui.toggleMessages();
            }, this, 'letter_open', 'letter', 'letter_open', 'letter_open');
            letter.anchor.setTo(0.5, 0);

            this.time.events.loop(Phaser.Timer.SECOND * 20, this.updateCounter, this);
            kettle = new Kettle(this.game, 4 * settings.tileSize + 20, 3 * settings.tileSize - 10, 0, this.isoGroup);
            kettle.anchor.setTo(0.5, 0);
            kettle2 = new Kettle(this.game, 4 * settings.tileSize + 20, 6 * settings.tileSize - 10, 0, this.isoGroup);
            kettle2.anchor.setTo(0.5, 0);

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50000);

            person = new Person(this.game, 1 * settings.tileSize, 4 * settings.tileSize, 0, this.isoGroup);
            person2 = new Person(this.game, 1 * settings.tileSize, 5 * settings.tileSize, 0, this.isoGroup);
            person.anchor.setTo(0.5, 0);
            person2.anchor.setTo(0.5, 0);

            floor = new Brew.Floor;

            $("#rahaa").text(budget);
            
            var kulutus = $("#kulutus").val();
            $("#kulutus")
                .on("blur", function () {
                    kulutus = $(this).val();
                });

            this.time.events.loop(Phaser.Timer.SECOND * 10, function () {
                budget = budget - parseInt(kulutus);
                Brew.Budget.update(budget);
                $("#rahaa").text(budget);
            }, this);

        },

        //selling beer
        sell: function (order) {
            if (storage.amount < order.amount) return false;
            else if (order.buyer == "Nalle") {
                budget = budget - 10;
                $("#rahaa").text(budget);
                var message = Brew.Budget.update(budget);
                Brew.gui.alert("Yksityishenkilölle myyminen on laitonta! Sait sakot." + message);
            } else {
                budget = budget + order.price * order.amount;
                $("#rahaa").text(budget);
                var message = Brew.Budget.update(budget);
                storage.amount -= order.amount;
                if (budget >= 100000) {
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
            this.game.iso.topologicalSort(this.isoGroup);
            this.messages.update();

            //check mouse position and put the cursor on the correct place:
            var _pos = new Phaser.Plugin.Isometric.Point3();
            this.game.iso.unproject(this.game.input.activePointer.position, _pos);

            if (Brew.noCursor) {
                this.cursor.isoX = this.cursor.isoY = -1000;
                return;
            }

            this.isoGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(_pos.x, _pos.y);
                if (inBounds) {
                    this.cursor.isoX = tile.isoX;
                    this.cursor.isoY = tile.isoY;
                }

            }, this);
            Brew.Floor.prototype.update();
        },


        /**
         * Creates the ground of play area.
         *
         * @private
         */
        __makeFloor: function () {
            var tile;
            for (var xx = 0; xx < 10 * settings.tileSize; xx += settings.tileSize) {
                for (var yy = 0; yy < 10 * settings.tileSize; yy += settings.tileSize) {
                    tile = this.add.isoSprite(xx, yy, 0, 'sprites', 'floor', this.isoGroup);
                    tile.inputEnabled = true;
                    tile.events.onInputDown.add(this.call, {
                        param: tile
                    }, this);
                    tile.anchor.set(0.5, 0);
                }
            }
        },

        call: function (tile) {
            Brew.Floor.prototype.setElement(tile);
            Brew.Floor.prototype.move(Brew.Person, tile);
        }
    };



    /**
     * Kettle IsoSprite that handles the cooking of beer.
     *
     * @class Brew.Kettle
     * @augments Phaser.Plugin.Isometric.IsoSprite
     * @param {Phaser.Game} game reference to the currently used game object
     * @param {Number}      x    iso X position
     * @param {Number}      y    iso X position
     * @param {Number}      z    iso X position
     */
    var Kettle = function (game, x, y, z, group) {
        //call super constructor
        Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'sprites', 'kettle', group);

        this.Person = null;
        this.inputEnabled = true;
        this.events.onInputDown.add(this.moveEmployee, this);
        this.events.onInputDown.add(this.check, this);
        this.events.onInputDown.add(function () {
            Brew.Kettle = this;
        }, this);
        /*        this.events.onInputDown.add(Brew.Floor.prototype.move, {
                    param1: Brew.Person,
                    param2: this
                }, Brew.Floor);*/

        this.events.onInputOver.add(function () {
            this.frameName = 'kettle_selected';
            Brew.noCursor = true;
        }, this);
        this.events.onInputOut.add(function () {
            this.frameName = 'kettle';
            Brew.noCursor = false;
        }, this);

        this.name = 'kettle';

        game.add.existing(this);
        Brew.Floor.prototype.setElement(this);
    };

    Kettle.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Kettle.prototype.constructor = Kettle;

    //move employee to Kettle
    Kettle.prototype.moveEmployee = function () {
        this.Person = Brew.Person;
        Brew.Floor.Person = Brew.Person;
        //    Brew.Floor.prototype.move(Brew.Person, this);
    };


    //check if there is employee beside the kettle and enough money for cook
    Kettle.prototype.check = function () {
        var aineet = parseInt($("#aineet").val());
        $("#aineet")
            .on("blur", function () {
                aineet = parseInt($(this).val());
            });

        if (!this.Person) {
            Brew.gui.alert("Siirrä työntekijä laitteen luokse.");
            return;
        }
        if (budget - aineet <= 0) {
            Brew.gui.alert("Rahasi eivät riitä uuden erän valmistamiseen.");
        } else {
            budget = budget - aineet;
            Brew.Budget.update(budget);
            $("#rahaa").text(budget);
            //   budget = budget - 1;
            Brew.Budget.update(budget);
            this.inputEnabled = false;
            //scoreText.setText("Cooking...");
            Brew.game.time.events.add(Phaser.Timer.SECOND * 4, this.cook, this);
            Brew.game.add.tween(this).to({
                isoZ: this.isoZ + 2
            }, Phaser.Timer.SECOND / 8, Phaser.Easing.Default, true, 0, 16, true);
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

    var Person = function (game, x, y, z, group) {
        Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'sprites', 'mies', group);

        this.inputEnabled = true;
        this.events.onInputDown.add(function () {
            Brew.Person = this;
        }, this);

        game.add.existing(this);
    };

    Person.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Person.prototype.constructor = Person;

    Brew.Person = null;

    var Order = function (type, amount, buyer) {
        //    this.age = age;
        this.type = type;
        this.amount = amount;
        this.buyer = buyer;

        this.price = $("#hinta").val();
        $("#hinta")
            .on("blur", function () {
                hinta = $(this).val();
            });
    };

    Order.prototype.random = function () {
        var types = ["lageria", "tummaa olutta", "portteria"];
        var buyers = ["Kesko", "Hemingways", "Vakiopaine", "Musta Kynnys", "Ale Pub", "S-Ryhmä", "Nalle"];

        var pieni = Brew.game.rnd.integerInRange(0, 10);
        var suuri = Brew.game.rnd.integerInRange(30, 40); //isoja tilauksia voisi tulla harvemmin
        var amountTypes = [pieni, suuri];

        return new Order(
            types[Brew.game.rnd.integerInRange(0, types.length - 1)],
            //     amountTypes[Brew.game.rnd.integerInRange(0, amountTypes.length - 1)],
            Brew.game.rnd.integerInRange(1, 10),
            //     Brew.game.time.totalElapsedSeconds(), 
            buyers[Brew.game.rnd.integerInRange(0, buyers.length - 1)]);
    };

    Order.prototype.message = function () {
        return this.amount + " koria " + this.type + " Tilaaja:" + this.buyer;
    };

    Brew.Order = Order;

})();