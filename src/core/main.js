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

            Brew.sfx = this.add.audioSprite('sfx');
            
            //////////////// STORAGES: /////////////////

            resourceStorage = new Brew.Storage(this.game, 'consumable', this.isoGroup, '');
            resourceStorage.base.x = 4 * settings.tileSize;
            resourceStorage.base.y = 8 * settings.tileSize;
            resourceStorage.amount = 5;
            resourceStorage.name = 'Tarvikkeita';
            storageManager = new Brew.StorageManager();


            //////////////// PRODUCERS: /////////////////

            lauterer = new Brew.Producer(this.game, 9 * settings.tileSize, 8 * settings.tileSize, 0, 'kettle1', this.isoGroup);
            lauterer.resource = resourceStorage;
            fermenter = new Brew.Producer(this.game, 9 * settings.tileSize, 5 * settings.tileSize, 0, 'kettle3_with_bubbles', this.isoGroup);
            maturer = new Brew.Producer(this.game, 9 * settings.tileSize, 2 * settings.tileSize, 0, 'kettle4', this.isoGroup);
            bottler = new Brew.Producer(this.game, 6 * settings.tileSize, 2 * settings.tileSize, 0, 'bottlemachine_step', this.isoGroup);

            fermenter.addOption('Tee lageria', 'lagerbutton', 'type', Brew.BeerType.LAGER);
            fermenter.addOption('Tee IPAa', 'ipabutton', 'type', Brew.BeerType.IPA);
            fermenter.addOption('Tee tummaa', 'darkbutton', 'type', Brew.BeerType.DARK);

            maturer.addOption('Pitkä kypsytys', 'long_brew', 'taste', 'Pehmeää');
            maturer.addOption('Pitkä kypsytys', 'short_brew', 'taste', 'Kitkerää');

            Brew.Producer.setChain(lauterer, fermenter, maturer, bottler);

            bottler.onBeerFinished.bind(this.beerFinished, this);
            

            ///((/////////////// DECOR: ////////////////////////

            var pipes = this.add.isoSprite(8 * settings.tileSize, 2.8 * settings.tileSize, 10, 'sprites', 'pipes2', this.isoGroup);
            pipes.anchor.set(0.5, 0.5);
            pipes = this.add.isoSprite(8 * settings.tileSize, 6 * settings.tileSize, 10, 'sprites', 'pipes', this.isoGroup);
            pipes.anchor.set(0.5, 0.5);

            
            //////////////// RIGHT BUTTONS: /////////////////

            var coin = this.add.button(840, 5, 'sprites', function () {}, this, 'moneybar', 'moneybar');
            coin.anchor.setTo(0.5, 0);
            coin.scale.set(0.8,0.8);

            Brew.gui.resources("Osta 1 erä raaka-aineita", this.buyMaterials, this);

            var seek = this.add.button(910, 75, 'sprites', function () {
                Brew.sfx.play('lyhin_kilahdus');
                var mess = new Brew.Messages().getMessage();
                Brew.gui.addMessage("Mainosta", mess.content, null, "✔", function () {
                    this.ad(mess);
                }, this);
                //letter.frameName = "letter_new_open 2";
            }, this, 'seek_button_over', 'seek_button_out');
            seek.anchor.setTo(0.5, 0);
        //    seek.scale.set(0.7,0.7);

            var mallas = this.add.button(910, 150, 'sprites', this.buyMaterials, //function () {
                // Brew.gui.toggleResources();
                //    },
                this, 'consumable_button_over', 'consumable_button_out');
            mallas.anchor.setTo(0.5, 0);
            
            //////////////// MESSAGE BG: //////////////////
            
            this.messagesBG = this.add.image(0, 20, 'sprites', 'messages_bg');

            //////////////// OTHER STUFF: /////////////////

            /*letter = this.add.button(50, 5, 'sprites', function () {
                Brew.gui.toggleMessages();
            }, this, 'letter_new_empty1', 'letter_new_unopened', 'letter_new_empty1', 'letter_new_empty1');
            letter.anchor.setTo(0.5, 0);*/

            Brew.Budget.create();
            Brew.Budget.moveProgressBar();
            Brew.Budget.update(50000);

            spending = 1000;
            /*$("#kulutus").val();
                        $("#kulutus")
                            .on("blur", function () {
                                spending = $(this).val();
                            });*/

            text = this.add.text(this.camera.width - 62, 42, budget, { font: '24px "Press Start 2P"'});
            text.fill = '#FFFFFF';
            text.align = 'right';
            text.anchor.setTo(1, 0.5);
            text.number = budget;

            changeText = this.add.text(this.camera.width - 62, 65, "", { font: '24px "Press Start 2P"'});
            changeText.fill = '#FFFFFF';
            changeText.anchor.setTo(1, 0.5);

            var walls = this.game.add.isoSprite(0.6 * settings.tileSize, 0.6 * settings.tileSize, 125, 'sprites', "back_wall_both", this.isoGroup);
            walls.anchor.setTo(0.5, 0);

            var music = this.game.add.audio('tausta');
            music.loop = true;
            music.volume = 0.4;
            music.play();
            music.onLoop.add(function () {
                music.play();
            }, this);

            //////////////// TIME EVENTS: /////////////////

            this.time.events.loop(Phaser.Timer.SECOND * 0.5, function () {
                if (bottler.state == Brew.ProducerState.PROCESSING) {
                    bottler.prosessingId++;
                    bottler._sprite.frameName = bottler._frame + bottler.prosessingId % 4;
                }
            }, this);

            var done = this.time.events.loop(Phaser.Timer.SECOND * 1, function () {
                if (storageManager.storages.length == 0) return;
                else {
                    this.initialBuyers();
                    this.time.events.remove(done);
                }
            }, this);

            this.time.events.loop(Phaser.Timer.SECOND * 20, function () {
                this.budgetHandling(-spending);
            }, this);

            //initial dirt for tutorial
            this.cleanUp();
            this.time.events.loop(Phaser.Timer.SECOND * 20, function () {
                this.cleanUp();
            }, this);

            /////////////////////// TUTORIAL: /////////////////////////

            this.tutorial = new Brew.Tutorial(this.game, this.isoGroup);
            this.tutorial.lauterer = lauterer;
            this.tutorial.fermenter = fermenter;
            this.tutorial.maturer = maturer;
            this.tutorial.bottler = bottler;
            this.tutorial.resources = resourceStorage;

            this.tutorial.start();
        },

        //add dirt all over game
        cleanUp: function () {
            var clean = this.add.isoSprite(Brew.game.rnd.integerInRange(0 * settings.tileSize, 10 * settings.tileSize), Brew.game.rnd.integerInRange(0 * settings.tileSize, 10 * settings.tileSize), 0, 'sprites', 'dirt', this.isoGroup);
            clean.anchor.setTo(0.5, 1);
            soDirtyEverywhere++;
            if (soDirtyEverywhere % 10 == 0) Brew.gui.alert("Hygieniasi on epäilyttävää. Sait sakot.", this.budgetHandling(-500), this);

            clean.inputEnabled = true;
            clean.events.onInputDown.add(function () {
                clean.destroy();
                soDirtyEverywhere--;
            }, this);
        },

        //buy consumable
        buyMaterials: function () {
            Brew.sfx.play('lyhin_kilahdus');
            
            if ( resourceStorage.amount < 30 ) {
                var price = -1000; //-$("#aineet").val();
                this.budgetHandling(price);
                resourceStorage.amount += 1;
            }
            else {
                Brew.gui.alert('Tarvikevarastosi on täynnä!');
            }
        },

        //advertising: legal cases increases amount of buyers, illegal may cause a defeat
        ad: function (mess) {
            this.budgetHandling(-parseInt(mess.due));

            var warning = "";
            if (mess.title != "Laillinen") {
                illegalAds++;
             //   this.sendBrag(mess.dueText, function () {});
                if (illegalAds == 5) {
                    Brew.gui.alert("Olet mainostanut liikaa laittomasti. Menetit toimilupasi ja hävisit pelin.");
                    this.gameOver();
                    return;
                } else warning = "Tämä on " + illegalAds + ". laiton mainos";
            } else this.createBuyer();
            Brew.gui.alert(mess.dueText + " " + warning);
        },

        //stop timer events, disable stuff, show a restart window or something
        gameOver: function () {
            this.time.events.removeAll();
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

            for (i in storageManager.storages) {
                var beerType = storageManager.storages[i].name;
                if (beerType == order.name) storagei = i;
            }

            if (storageManager.storages[storagei] == undefined) return false;

            if (storageManager.storages[storagei].amount < order.amount) return false;
            else if (order.buyer == "Erkki Virtanen") {
                this.budgetHandling(-500);
                Brew.gui.alert("Yksityishenkilölle myyminen on laitonta! Sait sakot.");
            } else {
                this.budgetHandling(order.price * order.amount);
                storageManager.storages[storagei].amount -= order.amount;
                orderList.splice(order.getIndex(order, orderList), 1);
                Brew.sfx.play('lyhyt_kilahdus');
            }
        },

        //add beer and get first orders
        beerFinished: function (beer) {
            Brew.sfx.play('lyhyt_kilahdus');
            storageManager.addBeer(beer, 4);
        },


        //first orders has to be small ones
        initialBuyers: function () {
            var initial = new Order().initialBuyers();
            for (i in initial) {
                buyerList.push(initial[i]);
                this.time.events.loop(Phaser.Timer.SECOND * 60, this.updateOrders, this, initial[i]);
            }
        },

        //every buyer sends an order in their own loop
        createBuyer: function () {
            var order = new Order();
            var buyer = order.newBuyer();
            buyerList.push(buyer);
            this.time.events.loop(Phaser.Timer.SECOND * 60, this.updateOrders, this, buyer);
        },

        /*
         * control orders
         */
        updateOrders: function (buyer) {
            if (buyerList == 0) {
                var allListElements = $('.brew-message');
                allListElements.each(function (index) {
                    $(this).remove();
                });
                Brew.gui.alert("Menetit kaikki tilaajasi.");
                this.time.events.removeAll();
                return;
            }

            var secondsToDisappear = 60000; //60 sekuntia

            //remove old orders
            orderList.forEach(function (order) {
                if (Brew.game.time.now - order.age > secondsToDisappear) {
                    var allListElements = $('.brew-message');

                    allListElements.each(function (index) {
                        if ($(this).data('messageData') == order) {
                            $(this).remove();
                            order.buyers.splice(order.getIndex(order.buyer, buyerList), 1);
                            orderList.shift();
                            return;
                        }
                    });
                    Brew.gui.alert("Tilaus vanhentui ja tilaaja " + order.buyer + " poistui tilaajalistaltasi.");
                }
            });

            var names = Brew.products;
            if (names.length <= 0) return;

            if (buyer != undefined) {
                var order = new Order().random(buyer, names);
                orderList.push(order);

                Brew.gui.addMessage('Tilaus', order.message(), order, "✔", this.sell, this, this.remove);
                Brew.sfx.play('ding');
                //letter.frameName = "letter_new_open 2";
            }
        },

        //remove rejected buyers
        remove: function (order) {
            order.buyers.splice(order.getIndex(order.buyer, buyerList), 1);
            orderList.splice(order.getIndex(order, orderList), 1);
            Brew.gui.alert("Tilaaja " + order.buyer + " poistui tilaajalistaltasi.");
            if (buyerList == 0) {
                var allListElements = $('.brew-message');
                allListElements.each(function (index) {
                    $(this).remove();
                });
                Brew.gui.alert("Menetit kaikki tilaajasi.");
                this.time.events.removeAll();
                return;
            }
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
                this.gameOver();
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

            this.floor.update();

            if (budget <= 100000 && budget >= 0) {
                text.setText(Math.floor(text.number));
            } else {
                text.setText(budget);
            }

        },

    };

    
    // O R D E R //////////////////////////////////////////////////////

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

        this.price = 500;
        /*$("#hinta").val();
                $("#hinta")
                    .on("blur", function () {
                        this.price = $(this).val();
                    });*/
    };

    Order.prototype.initialBuyers = function () {
        var buyers = [["Hemingways", 1], ["Vakiopaine", 1]];
        return buyers;
    };

    Order.prototype.getIndex = function (object, list) {
        for (var i = 0, j = list.length; i < j; i++) {
            if (list[i] === object) {
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