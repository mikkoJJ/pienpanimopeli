(function() {
    
    Brew.BeerType = {
        LAGER: 0, IPA: 1, DARK: 2
    };
    
    Brew.BeerTypeDescriptions = [ 'lageria', 'ipaa', 'tummaa olutta' ];
    
    Brew.BeerSprites = [ 'lager_case', 'porter_case', 'dark_case' ];
    
    
    var Beer = function(type, taste) {
        var _type = type ? type : Brew.BeerType.LAGER;
        var _taste = taste ? taste : 'pehmeää';
        
        this.type = _type;
        this.taste = _taste;
    };
    
    Beer.prototype.constructor = Beer;
    
    /**
     * Get the case sprite name for this type of beer.
     * @returns {string} the name of the sprite to use for this type of beer.
     */
    Beer.prototype.getSprite = function() {
        return Brew.BeerSprites[this.type];
    };
    
    
    /**
     * @property {string} A unique string representation of exactly this type of beer.
     * @readonly
     */
    Object.defineProperty(Beer.prototype, 'id', {
        get: function() {
            return '' + this.type; // + this.taste;
        }
    });
    
    /**
     * @property {string} description get a text description of this type of beer
     */
    Object.defineProperty(Beer.prototype, 'description', {
        get: function() {
            return this.taste + ' ' + Brew.BeerTypeDescriptions[this.type];
        }
    });
    

    Brew.Beer = Beer;
})();