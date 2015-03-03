(function() {

    var settings = {
        //the width of a tile in pixels
        tileWidth: 38,
        
        //the height of one case in pixels
        caseHeight: 20,
        
        //how many cases at max do we pile
        pileHeight: 5,
        
        //how many piles next to each other
        pileWidth: 4,
        
        //how many units of beer does one case represent
        caseValue: 1,
    };
    
    /**
     * @class Brew.Storage                           
     * 
     * @classdesc 
     * A Storage object keeps tabs of how much beer we have and represents that in
     * a nice graphical way by piling up beer cases.
     * 
     * @param {Phaser.Game} game reference to the game object to use.
     */
    var Storage = function(game, group) {
        this._game = game;
        this._group = group;
        this._amount = 0;
        this._cases = [];
        this._current = { x: 0, y: 0, z: 0 };
    };
    
    
    /**
     * Where the first case will be put.
     */
    Storage.prototype.base = {x: 0, y: 0, z: 0};
    

    Storage.prototype.addCase = function() {
        var _case = this._game.add.isoSprite(0, 0, 0, 'sprites', 'kori', this._group);
        //_case.anchor.set(0.2, 0.2);
        _case.isoX = this.base.x + settings.tileWidth * this._current.x;
        _case.isoY = this.base.y + settings.tileWidth * this._current.y;
        _case.isoZ = this.base.z + settings.caseHeight * this._current.z;
        
        _case.casePosition = {x: this._current.x, y: this._current.y, z: this._current.z};
        
        if ( ++this._current.z >= settings.pileHeight ) {
            if ( ++this._current.x >= settings.pileWidth ) {
                this._current.y++;
                this._current.x = 0;
            };
            this._current.z = 0;
        }
        
        this._cases.push(_case);
    };
    
    
    Storage.prototype.removeCase = function() {
        var _case = this._cases.pop();
        
        this._current.x = _case.casePosition.x;
        this._current.y = _case.casePosition.y;
        this._current.z = _case.casePosition.z;
        
        _case.destroy();
    };
    
    
    Object.defineProperty(Storage.prototype, 'amount', {
        
        get: function() {
            return this._amount;
        },
        
        set: function(newAmount) {
            var oldAmount = this._amount;
            
            var caseDifference = Math.floor(newAmount / settings.caseValue) - this._cases.length;
            
            if (caseDifference < 0) for (var i = caseDifference; i < 0; i++ ) this.removeCase(); 
            else for (var i = 0; i < caseDifference; i++ ) this.addCase();
            
            this._amount = newAmount;
        }
        
    });
        
    
    Brew.Storage = Storage;
})();