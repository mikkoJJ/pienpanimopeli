(function() {
    
    Brew.Tutorial = function(game) {
        this.game = game;
        this.group = game.add.group();
        
        this.texts = game.cache.getJSON('tutorial').tutorial;
        
        this.current = -1;
    };
    
    
    Brew.Tutorial.prototype = {
        
        /**
         * Start the tutorial.
         */
        start: function() {
            this.current = -1;
            this.next();
        },
        
        
        /**
         * Point at a thing.
         * 
         * @param {Number}   x iso x coordinate of the thing to point
         * @param {Number}   y iso y coordinate of the thing to point
         * @param {Number}   z iso z coordinate of the thing to point
         */
        point: function(x, y, z) {
            var arrow = this.game.add.isoSprite(x, y, z + 190, 'sprites', 'arrow', this.group);
            arrow.anchor.set(0.5, 0.5);
            
            this.game.add.tween(arrow).to({isoZ: z + 180}, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
        },
        
        
        /**
         * Show the next part of the tutorial.
         */
        next: function() {
            this.group.destroy();
            this.group = this.game.add.group();
            
            if (++this.current >= this.texts.length ) {
                Brew.gui.hideTutorialWindow();
                return;
            }
            
            for ( var i in this.texts[this.current].point ) {
                var elem = this[this.texts[this.current].point[i]];
                elem.onClick.add(function() {
                    this.next();
                }, this);    
                
                var pos = elem.isoPosition;
                this.point(pos.x, pos.y, pos.z);
            }
            
            Brew.gui.showTutorialWindow(this.texts[this.current].text);
        },
        
        update: function() {
            
            
        }
        
    };
    
})();