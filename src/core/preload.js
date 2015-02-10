(function() {
/**
 * The preloader state loads all game assets from the server so that it is
 * quickly accessible for the game. It will show a loading screen while it does it.
 * 
 * @class Brew.Boot
 * @constructor
 */
Brew.Preloader = function () {
    return;
};

Brew.Preloader.prototype = {
    
    create: function() {
    
        //add necessary game states. 
        //REMEMBER: The state's JS file will have to be included in the HTML file as well.
        this.state.add('Main', Brew.Main);
    },
    
    /**
     * Preloads the assets for the Preloader.
     * 
     * @public
     */
    preload: function () {
        this.progress = this.game.add.text(this.game.width / 2,
                                               this.game.height / 2,
                                               'Ladataan: 0 %',
                                  { font: '40pt bold Arial', fill: '#FFFFFF' });
        
        this.progress.anchor.set(0.5);
        this.progress.fixedToCamera = true;
        
        this.load.image('floor', 'assets/sprites/floor.png');
        
        Brew.game.plugins.add(new Phaser.Plugin.Isometric(Brew.game));
    },
    
    /**
     * Updates the load progress information.
     * 
     * @public
     */
    loadUpdate: function () {
        this.progress.text = 'Loading: ' + this.load.progress + ' %';
    },
   
    /**
     * When all assets have been preloaded we return here
     * and start the actual game state.
     * 
     * @public
     */
    update: function () {
        this.state.start('Main');
    }
};

})();