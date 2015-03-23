(function () {
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

        create: function () {

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
            'Loading: 0 %', {
                font: '40pt bold "Press Start 2P"',
                fill: '#FFFFFF'
            });

            this.progress.anchor.set(0.5);
            this.progress.fixedToCamera = true;
            
            Brew.game.plugins.add(new Phaser.Plugin.Isometric(Brew.game));
          //  Brew.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
            this.load.image('kattila', 'assets/sprites/single_sprites/kattila.png');
            this.load.image('paa_kattila_luonnos', 'assets/sprites/single_sprites/paa_kattila_luonnos.png');
            this.load.atlasJSONHash('sprites', 'assets/sprites/brew_sprites.png', 'assets/sprites/brew_sprites_data.json');
            this.load.json('texts', 'assets/json/texts.json');
            
            console.log('PRELOAD: Images loaded');
            
            Brew.gui = new Brew.GUI();
            
            console.log('PRELOAD: GUI initialized');
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