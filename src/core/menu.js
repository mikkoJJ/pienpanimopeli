(function () {

    var credits = 'Pelin kehittivät:    Mikko Jakonen   Elina Keränen   Anna Näveri    Arttu Seppänen';

    /**
     * The main menu of the game. Includes credits and splash screen.
     */
    Brew.Menu = function () {
        return;
    };

    Brew.Menu.prototype = {
        
        /**
         * Make the menu elements and add some tweens to make it nice-looking.
         */
        create: function () {
            
            this.logo = this.add.sprite(this.camera.width / 2, this.camera.height / 2 - 100, 'sprites', 'logo');
            this.logo.anchor.set(0.5);
            this.add.tween(this.logo).to({ y: this.logo.y + 10 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
            
            this.playbutton = this.add.button(this.logo.x, this.logo.y + 200, 'sprites', this.play, this, 'pelaa_over', 'pelaa_up');
            this.playbutton.anchor.set(0.5);
            
            var playButtonRotation = Math.PI / 40;
            this.playbutton.rotation =  -playButtonRotation;
            this.add.tween(this.playbutton).to({ rotation: playButtonRotation }, 3000, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
            
            this.credits = this.add.text(this.camera.width, this.playbutton.y + 200, credits, { fill: '#999' });
            this.credits.font = 'Press Start 2P';
            this.credits.fontSize = 20;
            this.add.tween(this.credits).to({ x: -2000 }, 30000, Phaser.Easing.Linear.None, true, 0, -1);
        },
        
        play: function() {
            this.state.start('Main');  
        },

    };

})();