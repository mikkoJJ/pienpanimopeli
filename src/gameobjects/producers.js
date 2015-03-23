(function(){
    
    /**
     * Enumeration for producer states.
     */
    Brew.ProducerState = {
        IDLE: 1, PROCESSING: 2, DONE: 3
    };
    
    
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
    var Producer = function(game, x, y, z, frame, group) {
        
        /** The encapsulated sprite: */
        this._sprite = game.add.isoSprite(x, y, z, 'sprites', frame, group);
        
        /** Private reference to the game. */
        this._game = game;
        
        /** The current state of the producer. */
        this.state = Brew.ProducerState.IDLE;
        
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
        this.workDuration = 10;
        
        this._sprite.anchor.setTo(0.5, 0.97);
        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(this._inputDown, this);
        //this._sprite.tint = 0xffaaaa;
    };
    
    Producer.prototype.constructor = Producer;
    
    
    /**
     * Begin producing
     * @param {Brew.Producer} from begin from where this producer left off (ie. continue the work of another Producer). Give null if starting production of new beer.
     */
    Producer.prototype.begin = function(from) {
        var beer;
        
        if ( from ) {
            beer = from.beer;
            from.end();
        } else 
            beer = new Brew.Beer();
        
        this.beer = beer;
        
        var workTween = this._game.add.tween(this._sprite.scale).to({x: 1.05, y: 1.05}, 100, Phaser.Easing.Linear.None, true, 0, this.workDuration, true);
        
        workTween.onComplete.add(function() {
            this.state = Brew.ProducerState.DONE;
            if( !this.next ) {
                this.onBeerFinished.fire(this.beer);
                this.end();
            }
        }, this);
        
        this.state = Brew.ProducerState.PROCESSING;
    };
    
    
    /**
     * Called when this prototype should end it's production.
     */
    Producer.prototype.end = function() {        
        this.state = Brew.ProducerState.IDLE;
        this.beer = null;
    };

    
    /** 
     * A simple event object to hold the beerfinished event, which is fired when this producer finished if it is 
     * the last producer in the chain.
     */
    Producer.prototype.onBeerFinished = {
        bind: function(callback, ctx) {
            this._callback = callback;
            this._ctx = ctx;
        },
        
        fire: function(arg) {
            console.log("AA");
            if( this._callback ) this._callback.call(this._ctx, arg);
        }
    };
    
    
    /**
     * Event callback to when the Producer sprite is clicked.
     * 
     * @private
     */
    Producer.prototype._inputDown = function() {
        if ( this.state == Brew.ProducerState.IDLE ) {
            if ( !this.previous ) {
                this.begin();    
            } else if ( this.previous.state == Brew.ProducerState.DONE ) {
                this.begin(this.previous);
            } 
        }
    };
    
    
    /**
     * Set up a production chain (ie. interlink the singular producers. Give the producers in the 
     * desired order as arguments to this function.
     *
     * @static
     */
    Producer.setChain = function() {
        for (var i = 0; i < arguments.length; i++ ) {
            arguments[i].previous = arguments[i-1];
            arguments[i].next = arguments[i+1];
        }
    };
    
    
    Brew.Producer = Producer;
})();