/**
 * The purpose of the Boot state is to load any assets the actual
 * Preloader might need. For example a loading icon or similar.
 * 
 * @class Brew.Boot
 * @constructor
 */
Brew.Booter = function () {
    return;
};

Brew.Booter.prototype = {

    /**
     * Preloads the assets for the Preloader.
     * 
     * @public
     */
    preload: function () {
       // TODO: Load any preloader assets here.
       
       return;
    },
   
    /**
     * Starts the Preloader state.
     * This is called once the asset loading has finished.
     * 
     * @public
     */
    update: function () {
        this.state.add('Preloader', Brew.Preloader, true);
    }
};

// Here we actually start the game, ie. boot up the Booter
(function () {
    var game = new Phaser.Game(960, 720, Phaser.AUTO, 'game');
    game.state.add('Booter', Brew.Booter, true);
    
    Brew.game = game;
}());