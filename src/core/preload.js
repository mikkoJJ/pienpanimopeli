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
            this.state.add('Menu', Brew.Menu);
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
            
            var _af = '';
            if ( typeof BREW_ASSETS_FOLDER !== 'undefined') _af = BREW_ASSETS_FOLDER;
        
            this.progress.anchor.set(0.5);
            this.progress.fixedToCamera = true;
            
            Brew.game.plugins.add(new Phaser.Plugin.Isometric(Brew.game));
          //  Brew.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
            this.load.atlasJSONHash('sprites', _af + 'assets/sprites/brew_sprites.png', _af +  'assets/sprites/brew_sprites_data.json');
            this.load.json('texts', _af + 'assets/json/texts.json');
            this.load.json('tutorial', _af + 'assets/json/tutorial.json');
            this.load.audio('tausta', [_af + 'assets/audio/tausta.mp3', _af + 'assets/audio/tausta.ogg']);
            this.load.audiosprite('sfx', [_af + 'assets/audio/sfx.ogg', _af + 'assets/audio/sfx.mp3'], _af + 'assets/audio/sfx.json');
            
            
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
            this.state.start('Menu');
        }
    };

})();