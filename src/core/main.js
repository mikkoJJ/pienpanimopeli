(function() { 

var 
    isoGroup
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

    create: function() {
        isoGroup = this.add.group();
        this.__makeFloor();
    },
    
    
    update: function () {
        
    },
    
    
    /**
     * Creates the ground of play area.
     * 
     * @private
     */
    __makeFloor: function () {
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = this.add.isoSprite(xx, yy, 0, 'floor', 0, isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }
};
})();