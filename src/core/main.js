(function() { 

var settings = {
    tileSize: 38 
};
    
    
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

    create: function() {
        this.isoGroup = this.add.group();
        this.__makeFloor();
        
        this.cursorPosition = 
        this.cursor = this.add.isoSprite(0, 0, 0, 'cursor', 0, this.isoGroup);
        //this.cursor.anchor.setTo(0.5);
    },
    
    
    update: function () {
        /*if ( this.game.input.activePointer.isDown ) {
            //this.game.iso.anchor.x += 0.001;
        }*/
        
        //check mouse position and put the cursor on the correct place:
        var _pos = new Phaser.Plugin.Isometric.Point3();
        this.game.iso.unproject(this.game.input.activePointer.position, _pos);
        
        this.isoGroup.forEach(function(tile) {
            var inBounds = tile.isoBounds.containsXY(_pos.x, _pos.y);
            if(inBounds) {
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
                //tile.anchor.set(0.5, 0.5);
            }
        }
    }
};
    
})();