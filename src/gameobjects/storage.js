(function() {

    var settings = {
        //the width of a tile in pixels
        tileWidth: 38,
        
        //the height of one case in pixels
        caseHeight: 18,
        
        //how many cases at max do we pile
        pileHeight: 5,
        
        //how many piles next to each other
        pileWidth: 3,
        
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
     * @param {string} spriteName the name of the sprite frame to pile in this storage
     * @param {Phaser.Group} group the group to add the sprites in.
     * @param {string} description a human-readable description of what this storage contains.
     */
    var Storage = function(game, spriteName, group, description, type) {
        //private vars:
        this._game = game;
        this._group = group;
        this._frame = spriteName;
        this._frameSelected = spriteName + '_selected';
        this._amount = 0;
        this._cases = [];
        this._current = { x: 0, y: 0, z: 0 };
        
        /** The name of the product to display */
        this.name = 'Nimetön';
        
        /** Where the first pile of cases will be placed in the world. */
        this.base = {x: 0, y: 0, z: 0};
        
        /** The "name" of the cases in this storage */
        this.description = description;
        
        this.type = type;  
    };
    
    Storage.prototype.constructor = Storage;
    
    
    /**
     * Add a case to the storage.
     */
    Storage.prototype.addCase = function() {
        var _case = this._game.add.isoSprite(0, 0, 0, 'sprites', this._frame, this._group);
        _case.anchor.set(0.5, 0.76);
        _case.isoX = this.base.x + settings.tileWidth * this._current.x;
        _case.isoY = this.base.y + settings.tileWidth * this._current.y;
        _case.isoZ = this.base.z + settings.caseHeight * this._current.z;
        
        _case.inputEnabled = true;
        _case.events.onInputOver.add(function() { this._mouseOver = true; }, _case);
        _case.events.onInputOut.add(function() { this._mouseOver = false; }, _case);
        
        _case.casePosition = {x: this._current.x, y: this._current.y, z: this._current.z};
        
        if ( ++this._current.z >= settings.pileHeight ) {
            if ( ++this._current.x >= settings.pileWidth ) {
                this._current.y++;
                this._current.x = 0;
            }
            this._current.z = 0;
        }
        
        this._cases.push(_case);
    };
    
    
    /**
     * Remove a case from the storage.
     * 
     * @private
     */
    Storage.prototype.removeCase = function() {
        var _case = this._cases.pop();
        
        this._current.x = _case.casePosition.x;
        this._current.y = _case.casePosition.y;
        this._current.z = _case.casePosition.z;
        
        _case.destroy();
    };
    
    
    Storage.prototype.moveEmployee = function() {
        Brew.game.add.tween(Brew.Person).to({
            isoX: this._current.x + 130,
            isoY: this._current.y,
            isoZ: 0
        }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
    };
    
    
    /**
     * Call this every update tick to update mouse interaction checks.
     * 
     * @public
     */
    Storage.prototype.update = function() {
        var _mouse = false;
        
        for ( var i = 0; i < this._cases.length; i++ ) {
            if ( this._cases[i]._mouseOver ) {
                _mouse = true;
                break;
            }
        }
        
        if ( _mouse && !this._selected ) {
            this._selected = true;
            for ( var j=0; j < this._cases.length; j++ ) {
                this._cases[j].frameName = this._frameSelected;
            }
            var infoPosition = this._game.iso.project(
                                new Phaser.Plugin.Isometric.Point3(
                                                            this.base.x + settings.tileWidth * 1,
                                                            this.base.y + settings.tileWidth * 1,
                                                            this.base.z + settings.tileWidth * settings.pileHeight)
                                                      );
            
            this._info = Brew.gui.showInfo(infoPosition.x - 100, infoPosition.y + 50, '<b>' + this.name + ':</b> ' + this.amount);
        } 
        
        if ( !_mouse && this._selected ) {
            this._selected = false;
            for ( var k=0; k < this._cases.length; k++ ) {
                this._cases[k].frameName = this._frame;
            }
            Brew.gui.hideInfo(this._info);
        }
    };
    
    
    /**
     * @property {number} amount The amount  Changing the value makes the cases appear or disappear.
     * @public
     */ 
    Object.defineProperty(Storage.prototype, 'amount', {
        
        get: function() {
            return this._amount;
        },
        
        set: function(newAmount) {
            var caseDifference = Math.floor(newAmount / settings.caseValue) - this._cases.length;
            
            if (caseDifference < 0) for (var i = caseDifference; i < 0; i++ ) this.removeCase(); 
            else for (var j = 0; j < caseDifference; j++ ) this.addCase();
            
            this._amount = newAmount;
        }
        
    });
        
    
    Brew.Storage = Storage;
})();