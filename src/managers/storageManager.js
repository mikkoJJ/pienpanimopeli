(function() {
    
    var settings = {
        tileSize: 38
    };
    
    var StorageManager = function() {
        this.storages = {};
        this.base = { x: 0, y: 0, z: 0 };
    };
    
    StorageManager.prototype.constructor = StorageManager;
    
    /**
     * Add some beer. If it is beer that has been made previously, put it in the correct
     * storage. Otherwise, create a new storage for this beer.
     * 
     * @param {Brew.Beer} beer the Beer object to add.
     * @public                        
     */
    StorageManager.prototype.addBeer = function(beer, amount) {
        if ( !this.storages[beer.id] ) this.newStorage(beer);
        this.storages[beer.id].amount += amount;
    };
    
    
    /**
     * Add a new storage object into the manager.
     * @param {Brew.Beer} beer the beer object to base the storage on.
     */
    StorageManager.prototype.newStorage = function(beer) {
        var _storage = new Brew.Storage(Brew.game, beer.getSprite(), this._group, beer.name);
        _storage.base = this.base;
        
        this.base.y += 2 * settings.tileSize;
        
        this.storages[beer.id] = _storage;
    };
    
    
    Brew.StorageManager = StorageManager;
})();