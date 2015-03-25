(function () {

    var settings = {
        tileSize: 38
    };

    //helper variables:
    var letter,
        i = 0,
        budget = 50000,
        lauterer,
        fermenter,
        lagerStorage,
        porterStorage,
        darkStorage,
        resourceStorage,
        person,
        person2,
        floor,
        spending,
        text;
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

            this.floor = new Brew.Floor();
            this.floor.makeFloor(this.game, this.isoGroup);


            //////////////// STORAGES: /////////////////

            lagerStorage = new Brew.Storage(this.game, 'lager_case', this.isoGroup, 'Lageria');
            lagerStorage.base.x = 0 * settings.tileSize;
            lagerStorage.base.y = 0 * settings.tileSize;
            lagerStorage.amount = 2;

            porterStorage = new Brew.Storage(this.game, 'porter_case', this.isoGroup, 'Portteria');
            porterStorage.base.x = 0 * settings.tileSize;
            porterStorage.base.y = 2 * settings.tileSize;
            porterStorage.amount = 2;

            darkStorage = new Brew.Storage(this.game, 'dark_case', this.isoGroup, 'Tummaa olutta');
            darkStorage.base.x = 0 * settings.tileSize;
            darkStorage.base.y = 4 * settings.tileSize;
            darkStorage.amount = 2;

            resourceStorage = new Brew.Storage(this.game, 'consumable', this.isoGroup, 'Ohramallasta');
            resourceStorage.base.x = 4 * settings.tileSize;
            resourceStorage.base.y = 0 * settings.tileSize;
            resourceStorage.amount = 5;

            //////////////// PRODUCERS: /////////////////

            lauterer = new Brew.Producer(this.game, 8 * settings.tileSize, 8 * settings.tileSize, 0, 'kettle', this.isoGroup);
            lauterer.resource = resourceStorage;
            fermenter = new Brew.Producer(this.game, 8 * settings.tileSize, 5 * settings.tileSize, 0, 'fermenter', this.isoGroup);

            Brew.Producer.setChain(lauterer, fermenter);

            fermenter.onBeerFinished.bind(this.beerFinished, this);

            
            //////////////// CURSOR: /////////////////
            
            /*this.cursor = this.add.isoSprite(0, 0, 1, 'sprites', 'select', this.isoGroup);
            this.cursor.anchor.setTo(0.5, 0.5);
            this.isoGroup.add(this.cursor);*/


            //////////////// PERSONS: /////////////////

            person = new Person(this.game, 1 * settings.tileSize, 4 * settings.tileSize, 10, this.isoGroup, this.floor);
            person2 = new Person(this.game, 1 * settings.tileSize, 7 * settings.tileSize, 10, this.isoGroup, this.floor);

            //////////////// RIGHT BUTTONS: /////////////////

            var coin = this.add.button(940, 0, 'sprites', function () {
                Brew.gui.addMessage("Mainosta", "Rakenna jättitölkki hintaan 1000 euroa?", null, "Oi kyllä!", this.ad, this);
            }, this, 'coin-symbol', 'coin-symbol');
            coin.anchor.setTo(0.5, 0);

            Brew.gui.seek("Ilmoita avoimesta työpaikasta", this.openJob, this);
            /*function () {
                this.time.events.loop(Phaser.Timer.SECOND * 2, this.openJob, this)
            }, this);*/
            Brew.gui.resources("Osta 1 erä raaka-aineita", this.buyMaterials, this);

            var seek = this.add.button(900, 50, 'sprites', function () {
                Brew.gui.toggleSeek();
            }, this, 'seek-employee-symbol', 'seek-employee-symbol');
            seek.anchor.setTo(0.5, 0);
            seek.scale.set(0.6, 0.6);

            var mallas = this.add.button(900, 140, 'sprites', function () {
                Brew.gui.toggleResources();
            }, this, 'mallas_symbol', 'mallas_symbol');
            mallas.anchor.setTo(0.5, 0);
            mallas.scale.set(0.4, 0.4);

            //////////////// OTHER STUFF: /////////////////

            letter = this.add.button(50, 5, 'sprites', function () {
                Brew.gui.toggleMessages();
            }, this, 'letter_new_empty1', 'letter_new_unopened', 'letter_new_empty1', 'letter_new_empty1');
            letter.anchor.setTo(0.5, 0);

            //letter_new_unopened

            this.time.events.loop(Phaser.Timer.SECOND * 10, this.updateCounter, this);

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50000);

            spending = $("#kulutus").val();
            $("#kulutus")
                .on("blur", function () {
                    spending = $(this).val();
                });

            this.time.events.loop(Phaser.Timer.SECOND * 20, function () {
                this.budgetHandling(-spending);
            }, this);

            text = this.add.text(880, 18, budget);
            text.fill = '#FFFFFF';
            text.anchor.setTo(0.5, 0);
            text.number = budget;

            changeText = this.add.text(880, 45, "");
            changeText.fill = '#FFFFFF';
            changeText.anchor.setTo(0.5, 0);
        },

        buyMaterials: function () {
            var price = -$("#aineet").val();
            this.budgetHandling(price);
            var beerType = Brew.gui.resourceWindow.data('type');
            resourceStorage.amount += 1;
        },

        //advertising
        ad: function () {
            this.budgetHandling(-100);
            Brew.gui.alert("Jättitölkkisi on laiton, sait sakot. Think of the children!");
        },

        //applications for a job
        openJob: function () {
            var names = ["Ville Viinamäki", "Pertti Pitkäaikaistyötön", "Riikka Raskaana"];
            Brew.gui.addMessage("Työhakemus", "Moi, olen " + names[0], null, "palkkaa", this.hire, this);
            Brew.gui.addMessage("Työhakemus", "Moi, olen " + names[1], null, "palkkaa", this.hire, this);
            Brew.gui.addMessage("Työhakemus", "Moi, olen " + names[2], null, "palkkaa", function () {
                this.hire(true)
            }, this);
        },

        //hire an employee
        hire: function (param1) {
            spending = parseInt(spending) + 500;
            var employee = new Person(Brew.game, Brew.game.rnd.integerInRange(0, 9) * settings.tileSize, 9 * settings.tileSize, 10, this.isoGroup, this.floor);
            if (param1) {
                this.time.events.add(Phaser.Timer.SECOND * 10, function () {
                    Brew.gui.alert("Työntekijäsi jäi äitiyslomalle. Sinun täytyy jatkaa palkan maksamista hänelle.");
                    employee.destroy();
                }, this);
            }
        },

        //selling beer
        sell: function (order) {
            if (lagerStorage.amount < order.amount) return false;
            else if (order.buyer == "Nalle") {
                this.budgetHandling(-10);
                Brew.gui.alert("Yksityishenkilölle myyminen on laitonta! Sait sakot.");
            } else {
                this.budgetHandling(order.price * order.amount);
                lagerStorage.amount -= order.amount;
            }

        },


        beerFinished: function (beer) {
            if (beer.type == Brew.BeerType.LAGER)
                lagerStorage.amount += 1;
            if (beer.type == Brew.BeerType.PORTER)
                porterStorage.amount += 1;
            if (beer.type == Brew.BeerType.DARK)
                darkStorage.amount += 1;
        },


        /*
         * control orders
         */
        updateCounter: function () {
            //   console.log(this.time.totalElapsedSeconds());
            //   if (i > 5) return;
            var order = new Order().random();
            var list = [];
            list[i++] = Brew.gui.addMessage('Tilaus', order.message(), order, "Myy", this.sell, this);

            var now = this.time.totalElapsedSeconds();
            if (now - order.age > 10) {
                //poista tilaus
            }
        },

        budgetHandling: function (money) {
            budget = budget + money;

            changeText.setText(money);
            if (money > 0) changeText.fill = "#106906";
            else changeText.fill = "#EE0A0A";

            this.time.events.add(2000, function () {
                changeText.setText("");
            }, this);

            if (budget <= 0) {
                Brew.gui.alert("Menetit kaikki rahasi ja hävisit pelin.");
                Brew.Budget.update(budget);
                text.setText(budget);
            } else if (budget >= 100000) {
                Brew.gui.alert("Liikevoittosi on ilmiömäinen. Voitit pelin!");
                Brew.Budget.update(budget);
                text.setText(budget);
            } else {
                Brew.Budget.startBudget(budget, text);
            }
        },

        update: function () {
            this.game.iso.simpleSort(this.isoGroup);
            this.messages.update();

            lagerStorage.update();
            darkStorage.update();
            porterStorage.update();
            resourceStorage.update();
            //check mouse position and put the cursor on the correct place:
            /*var _pos = new Phaser.Plugin.Isometric.Point3();
            this.game.iso.unproject(this.game.input.activePointer.position, _pos);

            if (Brew.noCursor) {
                this.cursor.isoX = this.cursor.isoY = -1000;
                return;
            }*

            this.isoGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(_pos.x, _pos.y);
                if (inBounds) {
                    this.cursor.isoX = tile.isoX;
                    this.cursor.isoY = tile.isoY;
                }

            }, this);*/

            this.floor.update();

            if (budget <= 100000 && budget >= 0) {
            //    Brew.Budget.startBudget(budget, text);
                text.setText(Math.floor(text.number));
            } else {
            //    Brew.Budget.update(budget);
                text.setText(budget);
            }
        },

    };


    var Person = function (game, x, y, z, group, floor) {
        Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'sprites', 'mies', group);
        this.anchor.set(0.5, 0.75);
        this.floor = floor;
        this.moving = false;
        this._frameUnselected = 'mies';
        this._frameSelected = 'mies_selected';

        this.inputEnabled = true;
        this.events.onInputDown.add(function () {
            this.floor.person = this;
        }, this);
        this.events.onInputOver.add(function () {
            this.frameName = this._frameSelected;
        }, this);
        this.events.onInputOut.add(function () {
            this.frameName = this._frameUnselected;
        }, this);

        game.add.existing(this);
        group.add(this);
    };

    Person.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Person.prototype.constructor = Person;

    Brew.Person = Person;

    var Order = function (type, amount, buyer) {
        //    this.age = age;
        this.type = type;
        this.amount = amount;
        this.buyer = buyer;

        this.price = $("#hinta").val();
        $("#hinta")
            .on("blur", function () {
                this.price = $(this).val();
            });
    };

    Order.prototype.random = function () {
        var types = ["lageria", "tummaa olutta", "portteria"];
        var pieni = Brew.game.rnd.integerInRange(1, 10);
        var suuri = Brew.game.rnd.integerInRange(30, 40); //isoja tilauksia voisi tulla harvemmin
        var amountTypes = [pieni, suuri];

        var buyers = [["Kesko", suuri], ["Hemingways", pieni], ["Vakiopaine", pieni], ["Musta Kynnys", pieni], ["Ale Pub", pieni], ["S-Ryhmä", suuri], ["Nalle", pieni]];

        var currentBuyer = buyers[Brew.game.rnd.integerInRange(0, buyers.length - 1)];

        return new Order(
            types[Brew.game.rnd.integerInRange(0, types.length - 1)],
            currentBuyer[1],
            currentBuyer[0]);
        //     amountTypes[Brew.game.rnd.integerInRange(0, amountTypes.length - 1)],
        //Brew.game.rnd.integerInRange(1, 10),
        //     Brew.game.time.totalElapsedSeconds(), 
        //    buyers[Brew.game.rnd.integerInRange(0, buyers.length - 1)]);
    };

    Order.prototype.message = function () {
        return this.amount + " koria " + this.type + " Tilaaja:" + this.buyer;
    };

    Brew.Order = Order;

})();