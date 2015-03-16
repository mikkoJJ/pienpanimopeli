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
        
        /* The encapsulated sprite: */
        this._sprite = game.add.isoSprite(x, y, z, 'sprites', frame, group);
        
        /** The current state of the producer. */
        this.state = Brew.ProducerState.IDLE;
        
        /** The next stage in the production chain. */
        this.next = null;
        
        /** Reference to the beer object we are working on. */
        this.beer = null;
        
        /** If this producer uses resources, specify the storage it takes them from. */
        this.takesFrom = null;
        
        /** Is this the final phase of the production. */
        this.isFinal = false;
        
        this._sprite.anchor.setTo(0.5, 0.9);
        this._sprite.inputEnabled = true;
        this._sprite.events.onInputDown.add(this._inputDown);
    };
    
    Producer.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Producer.prototype.constructor = Producer;
    
    
    /**
     * Event callback to when the Producer sprite is clicked
     * @private
     */
    Producer.prototype._inputDown = function() {
        //stuffs
    };
    
    
    Brew.Producer = Producer;
})();