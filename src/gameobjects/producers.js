(function(){
    
    /**
     * Enumeration for producer states.
     */
    Brew.ProducerState = {
        IDLE: 0, PROCESSING: 1, DONE: 2
    };
    
    var STATE_ICONS = [
        'producer_idle', 'producer_active', 'producer_done'
    ];
    
    
    /**
     * A Producer is a single step in the production chain.
     * 
     * @param {Phaser.Game} game  - reference to the Phaser game object to use.
     * @param {number} x - iso x coordinate to place this producer in.
     * @param {number} y - iso x coordinate to place this producer in.
     * @param {number} z - iso x coordinate to place this producer in.
     * @param {number} frame - the sprite frame reference to this producer's sprite
     * @param {number} group - the (iso) group in which to put this sprite.
     */
    var Producer = function (game, x, y, z, frame, group) {

        /** The encapsulated sprite: */
        this._sprite = game.add.isoSprite(x, y, z, 'sprites', frame, group);

        /** Private reference to the game. */
        this._game = game;

        /** The current state of the producer. */
        this._state = Brew.ProducerState.IDLE;

        /** The next stage in the production chain. */
        this.next = null;

        /** The previous stage in the production chain. */
        this.previous = null;

        /** Reference to the beer object we are working on. */
        this.beer = null;

        /** If this producer uses resources, specify the storage it takes them from. */
        this.resource = null;

        /** Is this the final phase of the production. */
        this.isFinal = false;

        /** How long it takes for the producer to finish */
        this.workDuration = 20;

        /** An offset given to the centre of the radial option menu. */
        this.optionOffset = {
            x: -30,
            y: -70
        };

        /** A signal dispatched when the producer is clicked. */
        this.onClick = new Phaser.Signal();

        this.prosessingId = 0;
        this._frameProsessing = frame + this.prosessingId;


        /** 
         * A simple event object to hold the beerfinished event, which is fired when this producer finished if it is
         * the last producer in the chain.
         */
        this.onBeerFinished = {
            bind: function (callback, ctx) {
                this._callback = callback;
                this._ctx = ctx;
            },

            fire: function (arg) {
                if (this._callback) this._callback.call(this._ctx, arg);
            }
        };

        /** Which option is selected. */
        this._selectedOption = 0;

        this._options = [];

        this._frame = frame;
        this._frameSelected = frame + '_selected';

        this._sprite.anchor.setTo(0.5, 0.97);
        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(this._inputDown, this);
        this._sprite.events.onInputOver.add(this._inputOver, this);
        this._sprite.events.onInputOut.add(this._inputOut, this);
        //this._sprite.tint = 0xffaaaa;

        this._indicator = game.add.isoSprite(x, y, z + 140, 'sprites', 'producer_idle', group);
        this._indicator.anchor.set(0.5, 0.5);
        this._indicator.pivot.set(0.5, 0.5);
        game.add.tween(this._indicator).to({
            isoZ: z + 145
        }, 1800, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
    };

    Producer.prototype.constructor = Producer;


    /**
     * Begin producing
     * @param {Brew.Producer} from begin from where this producer left off (ie. continue the work of another Producer). Give null if starting production of new beer.
     */
    Producer.prototype.begin = function (from) {
        var beer;

        if (from) {
            beer = from.beer;
            from.end();
        } else
            beer = new Brew.Beer();

        if (this.resource) {
            this.resource.amount -= 1;
        }

        this.beer = beer;

        if (this.currentOption) beer[this.currentOption._parameter] = this.currentOption._value;


        var workTween = this._game.add.tween(this._sprite.scale).to({
            x: 1.02,
            y: 1.02
        }, 100, Phaser.Easing.Linear.None, true, 0, this.workDuration, true);

        workTween.onComplete.add(function () {
            this.state = Brew.ProducerState.DONE;
            if (!this.next) {
                this.onBeerFinished.fire(this.beer);
                this.end();
            } else {
                this.next.begin(this);
            }
        }, this);

        this.state = Brew.ProducerState.PROCESSING;
        this._sprite.frameName = this._frameProsessing;

    };


    /**
     * Called when this prototype should end it's production.
     */
    Producer.prototype.end = function () {
        this.state = Brew.ProducerState.IDLE;
        this.beer = null;
        this._sprite.frameName = this._frame;
    };


    /**
     * Add an option to the producer. Options are displayed as a radial menu when the
     * mouse hovers over the producer.
     *
     * @param {String} name      the name of the option
     * @param {String} sprite    the sprite used as the icon for this option
     * @param {String} parameter the parameter (attribute of the producerd Beer object) this option affects
     * @param {Object} value     the value given to the previously defined parameter
     */
    Producer.prototype.addOption = function (name, sprite, parameter, value) {
        var option = this._game.add.sprite(this._sprite.x + this.optionOffset.x, this._sprite.y + this.optionOffset.y, 'sprites', sprite + '_over');
        if (this._options.length > 0) option.frameName = sprite + '_out';
        option.visible = false;

        option._parameter = parameter;
        option._value = value;
        option._sprite = sprite;

        this._options.push(option);
    };


    /**
     * @property {Number} state the current state of the producer. One of @see Brew.ProducerState.
     */
    Object.defineProperty(Producer.prototype, 'state', {

        get: function () {
            return this._state;
        },

        set: function (newState) {
            this._state = newState;
            this._indicator.frameName = STATE_ICONS[newState];
            if (newState == Brew.ProducerState.PROCESSING) {
                this._indicatorTween = this._game.add.tween(this._indicator).to({
                    rotation: Math.PI * 2
                }, 800, Phaser.Easing.Cubic.In, true, 0, -1, false);
            } else {
                this._indicatorTween.stop();
                this._indicator.rotation = 0;
            }
        }

    });


    /**
     * @property {Number} The index of the option that is currently selected on this producer. For the actual
     * option, @see currentOption
     */
    Object.defineProperty(Producer.prototype, 'selectedOption', {

        get: function () {
            return this._selectedOption;
        },

        set: function (newOptionNum) {
            var oldOption = this._options[this._selectedOption];
            var newOption = this._options[newOptionNum];

            oldOption.frameName = oldOption._sprite + '_out';
            newOption.frameName = newOption._sprite + '_over';

            this._selectedOption = newOptionNum;
        }

    });


    /**
     * @property {Brew.Option} the producer option object that is currently selected.
     */
    Object.defineProperty(Producer.prototype, 'currentOption', {

        get: function () {
            return this._options[this.selectedOption];
        }

    });

    /**
     * @property {Phaser.Plugin.Isometric.Point3} the iso position of the producer
     */
    Object.defineProperty(Producer.prototype, 'isoPosition', {

        get: function () {
            return this._sprite.isoPosition;
        }

    });


    /**
     * Event callback to when the Producer sprite is clicked.
     *
     * @private
     */
    Producer.prototype._inputDown = function () {
        if (this.state == Brew.ProducerState.IDLE) {
            if (!this.previous) {
                this.begin();
            }
            /*else if ( this.previous.state == Brew.ProducerState.DONE ) {
                            this.begin(this.previous);
                        } */
        }
        if (this._options.length > 0) {
            if (this.selectedOption >= this._options.length - 1) this.selectedOption = 0;
            else this.selectedOption = this.selectedOption + 1;
        }

        this.onClick.dispatch();
    };


    /**
     * Event callback to when the Producer sprite is clicked.
     *
     * @private
     */
    Producer.prototype._inputOver = function () {
        this._sprite.frameName = this._frameSelected;
        var theta = 0;
        var r = 40;
        var toX, toY;

        var option;
        for (var i = 0; i < this._options.length; i++) {
            option = this._options[i];
            option.visible = true;

            theta = i * ((Math.PI * 2) * (1 / 6));

            toX = this._sprite.x + this.optionOffset.x + r * Math.cos(theta);
            toY = this._sprite.y + this.optionOffset.y + r * Math.sin(theta);

            this._game.add.tween(option).to({
                x: toX,
                y: toY
            }, 300, Phaser.Easing.Cubic.Out, true);
        }
    };

    /**
     * Event callback to when the Producer sprite is clicked.
     *
     * @private
     */
    Producer.prototype._inputOut = function () {
        this._sprite.frameName = this._frame;

        for (var i = 0; i < this._options.length; i++) {
            var option = this._options[i];
            option.visible = false;
            option.x = this._sprite.x + this.optionOffset.x;
            option.y = this._sprite.y + this.optionOffset.y;
        }
    };


    /**
     * Set up a production chain (ie. interlink the singular producers. Give the producers in the
     * desired order as arguments to this function.
     *
     * @static
     */
    Producer.setChain = function () {
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].previous = arguments[i - 1];
            arguments[i].next = arguments[i + 1];
        }
    };


    Brew.Producer = Producer;
})();