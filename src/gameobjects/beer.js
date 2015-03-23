(function() {
    
    Brew.BeerType = {
        LAGER: 1, PORTER: 2, DARK: 3
    };
    
    
    var Beer = function() {
        this.type = Brew.BeerType.LAGER;
    };
    
    Beer.prototype.constructor = Beer;
    
    

    Brew.Beer = Beer;
})();