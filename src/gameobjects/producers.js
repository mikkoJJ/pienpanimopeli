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
        Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'sprites', frame, group);
        
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
        
        game.add.existing(this);
    };
    
    Producer.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
    Producer.prototype.constructor = Producer;
    
    
    Producer.prototype.begin = function() {
        
    };
    
    
    Brew.Producer = Producer;
})();