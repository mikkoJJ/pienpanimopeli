(function () {

    var settings = {
        tileSize: 38
    };

    //helper variables:
    var letter,
        budget = 50000,
        lauterer,
        fermenter,
        maturer,
        bottler,
        lagerStorage,
        porterStorage,
        darkStorage,
        storageManager,
        resourceStorage,
        person,
        person2,
        floor,
        spending,
        text,
        orderList = [],
        buyerList = [],
        buyers,
        soDirtyEverywhere = 0,
        illegalAds = 0;
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
            this.game.iso.anchor.setTo(0.5, 0.3);
            this.messages = new Brew.Messages();

            this.isoGroup = this.add.group();

            this.floor = new Brew.Floor();
            this.floor.makeFloor(this.game, this.isoGroup);


            //////////////// STORAGES: /////////////////

            resourceStorage = new Brew.Storage(this.game, 'consumable', this.isoGroup, 'Ohramallasta');
            resourceStorage.base.x = 4 * settings.tileSize;
            resourceStorage.base.y = 8 * settings.tileSize;
            resourceStorage.amount = 5;
            resourceStorage.name = 'Mallasta';
            storageManager = new Brew.StorageManager();


            //////////////// PRODUCERS: /////////////////

            lauterer = new Brew.Producer(this.game, 8 * settings.tileSize, 8 * settings.tileSize, 0, 'kettle1', this.isoGroup);
            lauterer.resource = resourceStorage;
            fermenter = new Brew.Producer(this.game, 8 * settings.tileSize, 5 * settings.tileSize, 0, 'kettle3_with_bubbles', this.isoGroup);
            maturer = new Brew.Producer(this.game, 8 * settings.tileSize, 2 * settings.tileSize, 0, 'kettle4', this.isoGroup);
            bottler = new Brew.Producer(this.game, 5 * settings.tileSize, 2 * settings.tileSize, 0, 'bottlemachine_step1', this.isoGroup);

            fermenter.addOption('Tee lageria', 'lagerbutton', 'type', Brew.BeerType.LAGER);
            fermenter.addOption('Tee IPAa', 'ipabutton', 'type', Brew.BeerType.IPA);
            fermenter.addOption('Tee tummaa', 'darkbutton', 'type', Brew.BeerType.DARK);

            maturer.addOption('Pitkä kypsytys', 'long_brew', 'taste', 'Pehmeää');
            maturer.addOption('Pitkä kypsytys', 'short_brew', 'taste', 'Kitkerää');

            Brew.Producer.setChain(lauterer, fermenter, maturer, bottler);

            bottler.onBeerFinished.bind(this.beerFinished, this);


            ///((/////////////// DECOR: ////////////////////////

            var pipes = this.add.isoSprite(7 * settings.tileSize, 2.8 * settings.tileSize, 10, 'sprites', 'pipes2', this.isoGroup);
            pipes.anchor.set(0.5, 0.5);
            pipes = this.add.isoSprite(7 * settings.tileSize, 6 * settings.tileSize, 10, 'sprites', 'pipes', this.isoGroup);
            pipes.anchor.set(0.5, 0.5);

            /////////////////// PERSONS: ///////////////////////

            person = new Person(this.game, 1 * settings.tileSize, 4 * settings.tileSize, 10, this.isoGroup, this.floor);
            person2 = new Person(this.game, 1 * settings.tileSize, 7 * settings.tileSize, 10, this.isoGroup, this.floor);

            //////////////// RIGHT BUTTONS: /////////////////

            var coin = this.add.button(940, 0, 'sprites', function () {}, this, 'money_symbol', 'money_symbol');
            coin.anchor.setTo(0.5, 0);

            Brew.gui.resources("Osta 1 erä raaka-aineita", this.buyMaterials, this);

            var seek = this.add.button(900, 75, 'sprites', function () {
                var mess = new Brew.Messages().getMessage();
                Brew.gui.addMessage("Mainosta", mess.content, null, "Oi kyllä!", function () {
                    this.ad(mess);
                }, this);
                letter.frameName = "letter_new_open 2";
                //  Brew.gui.toggleSeek();
            }, this, 'seek-employee-symbol', 'seek-employee-symbol');
            seek.anchor.setTo(0.5, 0);

            var mallas = this.add.button(900, 190, 'sprites', this.buyMaterials, //function () {
                // Brew.gui.toggleResources();
                //    },
                this, 'consumable', 'consumable');
            mallas.anchor.setTo(0.5, 0);

            //////////////// OTHER STUFF: /////////////////

            letter = this.add.button(50, 5, 'sprites', function () {
                Brew.gui.toggleMessages();
            }, this, 'letter_new_empty1', 'letter_new_unopened', 'letter_new_empty1', 'letter_new_empty1');
            letter.anchor.setTo(0.5, 0);

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50000);

            spending = $("#kulutus").val();
            $("#kulutus")
                .on("blur", function () {
                    spending = $(this).val();
                });

            text = this.add.text(880, 18, budget);
            text.fill = '#FFFFFF';
            text.anchor.setTo(0.5, 0);
            text.number = budget;

            changeText = this.add.text(880, 45, "");
            changeText.fill = '#FFFFFF';
            changeText.anchor.setTo(0.5, 0);

            var rightWall = this.game.add.isoSprite(4.4 * settings.tileSize, 0 * settings.tileSize, 5, 'sprites', "back_wall_right", this.isoGroup);
            rightWall.anchor.setTo(0.5, 0.75);
            
            var wall = this.game.add.isoSprite(0 * settings.tileSize,  4.4 * settings.tileSize, 5, 'sprites', "back_wall_left", this.isoGroup);
            wall.anchor.setTo(0.5, 0.75);
            
            //////////////// TIME EVENTS: /////////////////

            var tutorialTime = 0;
            this.time.events.add(Phaser.Timer.SECOND * tutorialTime, function () {
                this.initialBuyers();
                //  this.createBuyers();
            }, this);

            this.time.events.loop(Phaser.Timer.SECOND * 20, function () {
                this.budgetHandling(-spending);
            }, this);

            this.time.events.loop(Phaser.Timer.SECOND * 20, function () {
                this.cleanUp();
            }, this);
            
            
            
            /////////////////////// TUTORIAL: /////////////////////////
            
            this.tutorial = new Brew.Tutorial(this.game, this.isoGroup);
            this.tutorial.lauterer = lauterer;
            this.tutorial.fermenter = fermenter;
            this.tutorial.maturer = maturer;
            this.tutorial.bottler = bottler;
            
            this.tutorial.start();
        },

        cleanUp: function () {
            var clean = this.add.isoSprite(Brew.game.rnd.integerInRange(50, 200), Brew.game.rnd.integerInRange(50, 200), 100, 'sprites', 'dirt', this.isoGroup);
            soDirtyEverywhere++;
            if (soDirtyEverywhere % 10 == 0) Brew.gui.alert("Hygieniasi on epäilyttävää. Sait sakot.", this.budgetHandling(-100), this);

            clean.inputEnabled = true;
            clean.events.onInputDown.add(function () {
                clean.destroy();
                soDirtyEverywhere--;
            }, this);
        },

        buyMaterials: function () {
            var price = -$("#aineet").val();
            this.budgetHandling(price);
            var beerType = Brew.gui.resourceWindow.data('type');
            resourceStorage.amount += 1;
        },

        //advertising: legal cases increases amount of buyers, illegal may cause a defeat
        ad: function (mess) {
            this.budgetHandling(-parseInt(mess.due));

            var warning = "";
            if (mess.title != "Laillinen") {
                illegalAds++;
                this.sendBrag(mess.dueText, function () {});
                if (illegalAds == 5) {
                    Brew.gui.alert("Olet mainostanut liikaa laittomasti. Menetit toimilupasi ja hävisit pelin.");
                    return;
                } else warning = "Tämä on " + illegalAds + ". laiton mainos";
            } else this.createBuyer();
            Brew.gui.alert(mess.dueText + " " + warning);
        },

        //toimii oikein
        sendBrag: function (caption, callback) {
            FB.ui({
                method: 'feed',
                caption: caption,
                //   link: 'localhost:8080/pienpanimopeli',
                picture: 'localhost:8080/pienpanimopeli/assets/sprites/single_sprites/giantcan.png', //ei näy julkaisussa
                name: 'Testing'
            }, callback); //what to do with response


        },

        //hire an employee
        hire: function () {
            spending = parseInt(spending) + 500;
            var employee = new Person(Brew.game, Brew.game.rnd.integerInRange(0, 9) * settings.tileSize, 9 * settings.tileSize, 10, this.isoGroup, this.floor);
        },

        //selling beer
        sell: function (order) {
            var storagei;

            for (i in storageManager.storages) { //storageiden omat indexit tulee siinä järjestyksessä kuin niitä valmistetaan eikä riipu oluttyypistä
                var beerTypeIndex = storageManager.storages[i].type;
                var name = this.getType(beerTypeIndex);
                    console.log(storageManager.storages[i].description); //undefined

                if (name == order.type) storagei = i;
            }
            if (storageManager.storages[storagei] == undefined) return false;
            console.log(storageManager.storages[storagei].description)

            if (storageManager.storages[storagei].amount < order.amount) return false;
            else if (order.buyer == "Erkki Virtanen") {
                this.budgetHandling(-10);
                Brew.gui.alert("Yksityishenkilölle myyminen on laitonta! Sait sakot.");
            } else {
                this.budgetHandling(order.price * order.amount);
                storageManager.storages[storagei].amount -= order.amount;
                var index = -1;
                for (var i = 0, j = orderList.length; i < j; i++) {
                    if (orderList[i] === order)
                        index = i;
                }
                orderList.splice(index, 1);
            }

        },

        //get name of beertype
        getType: function (typeIndex) {
            var types = ["lager", "IPA", "dark"];
            return types[typeIndex];
        },

        //add beer and get first orders
        beerFinished: function (beer) {
            /*if (beer.type == Brew.BeerType.LAGER)
                lagerStorage.amount += 1;
            if (beer.type == Brew.BeerType.IPA)
                porterStorage.amount += 1;
            if (beer.type == Brew.BeerType.DARK)
                darkStorage.amount += 1;*/
            storageManager.addBeer(beer, 4);
            this.initialBuyers();
        },


        //first orders has to be little ones
        initialBuyers: function () {
            var initial = new Order().initialBuyers();
            for (i in initial) {
                buyerList.push(initial[i]);

                console.log(storageManager.storages.length + " storagea");
                //      if (storageManager.storages.length > 0)
                this.time.events.loop(Phaser.Timer.SECOND * 15, this.updateOrders, this, initial[i]);
            }
            console.log(buyerList);
        },

        //every buyer sends an order in their own loop
        createBuyer: function () {
            var order = new Order();
            var buyer = order.newBuyer();
            buyerList.push(buyer);
            this.time.events.loop(Phaser.Timer.SECOND * 25, this.updateOrders, this, buyer);
            console.log(buyerList);
        },

        /*
         * control orders
         */
        updateOrders: function (buyer) {
            if (buyerList == 0) {
                Brew.gui.alert("Menetit kaikki tilaajasi.");
                return;
            }

            var names = Brew.products; //[storageManager.storages[0].description];
            if (!names) names = ["nimi", "toinen nimi"];
            console.log(Brew.products + " käyttäjän antamat nimet");

            if (buyer != undefined) {
                var order = new Order().random(buyer, names);
                orderList.push(order);

                Brew.gui.addMessage('Tilaus', order.message(), order, "Myy", this.sell, this, this.remove);
                letter.frameName = "letter_new_open 2";
            }
        },

        //remove rejected buyers
        remove: function (order) {
            order.buyers.splice(order.getIndex(), 1);
            console.log(buyerList);
        },

        budgetHandling: function (money) {
            budget = budget + money;

            changeText.setText(money);
            if (money >= 0) changeText.fill = "#106906";
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

            storageManager.update();
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

            var secondsToDisappear = 60000; //60 sekuntia

            //remove old orders
            orderList.forEach(function (order) {
                if (Brew.game.time.now - order.age > secondsToDisappear) {
                    var allListElements = $('.brew-message');

                    allListElements.each(function (index) {
                        if ($(this).data('messageData') == order) {
                            $(this).remove();
                            order.buyers.splice(order.getIndex(), 1);
                            console.log(buyerList.length);
                            //  console.log(buyerList);
                            orderList.shift();
                            return;
                        }
                    });
                }
            });
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

    var Order = function (type, amount, buyer, name) {
        this.age = Brew.game.time.now;
        this.type = type;
        this.amount = amount;
        this.buyer = buyer;
        this.name = name;

        this.buyers = buyerList;

        var pieni = 1;
        var suuri = 15;
        this.staticBuyers = [["Alko", suuri], ["Kesko", suuri], ["S-Ryhmä", suuri], ["Musta Kynnys", pieni], ["Ale Pub", pieni], ["Erkki Virtanen", pieni], ["Iso Baari", pieni], ["Pub Rousku", pieni], ["Oluthuone Rymy", pieni], ["Gastropub Lohi", pieni], ["Rappiohuone", pieni], ["Hilkan pubi", pieni]];

        this.price = $("#hinta").val();
        $("#hinta")
            .on("blur", function () {
                this.price = $(this).val();
            });
    };

    Order.prototype.initialBuyers = function () {
        var buyers = [["Hemingways", 1], ["Vakiopaine", 1]];
        return buyers;
    };

    Order.prototype.getIndex = function () {
        for (var i = 0, j = this.buyers.length; i < j; i++) {
            if (this.buyers[i] === this.buyer) {
                return i;
            }
        }
        return -1;
    };

    Order.prototype.newBuyer = function () {
        var buyer = this.staticBuyers[Brew.game.rnd.integerInRange(0, this.staticBuyers.length)];
        return buyer;
    };

    Order.prototype.random = function (buyer, names) {
        var types = ["lager", "IPA", "dark"];
        var amountType = buyer[1];
        var amount = Brew.game.rnd.integerInRange(amountType, amountType + 5);

        return new Order(
            types[Brew.game.rnd.integerInRange(0, types.length - 1)],
            amount, //amount
            buyer[0],
            names[Brew.game.rnd.integerInRange(0, names.length - 1)]); //name
    };

    Order.prototype.message = function () {
        return this.amount + " koria: " + this.name + " Tilaaja:" + this.buyer;
    };

    Brew.Order = Order;

})();