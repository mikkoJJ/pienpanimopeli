(function() { 

var settings = {
    tileSize: 38 
};
    
    
/**
 * This is the main game state that starts when all assets are loaded.
 * 
 * @class Brew.Main
 * @constructor
 */
Brew.Main = function () {
    return;
};
    
    var image, scoreText, output, timer, counter = 0, sakot, i=0;
    
Brew.Main.prototype = {

    create: function() {
        this.isoGroup = this.add.group();
        this.__makeFloor();
        
        this.cursorPosition = 
        this.cursor = this.add.isoSprite(0, 0, 0, 'cursor', 0, this.isoGroup);
        //this.cursor.anchor.setTo(0.5);
        
        image = this.add.sprite(this.width, this.height, 'letter');
        image.scale.set(0.2,0.2);
        image.anchor.setTo(0, 0);
     //   image.anchor.set(0.5);
        image.inputEnabled = true;
      //  image.events.onInputDown.add(this.listener, this);

        image.inputEnabled = true;
        image.input.start();
        
        //aputeksti kehitysvaiheelle
         scoreText = this.add.text(
                this.world.centerX + 300,
                this.world.height / 5, "",
                {
                    size: "32px",
                    fill: "#FFF",
                    align: "center"
                }
             
            );
            scoreText.anchor.set(0.5);
            scoreText.setText("Seconds");
        //   scoreText.anchor.setTo(0, 1); 
        
            timer = this.time.create(false);
            timer.loop(Phaser.Timer.SECOND, this.updateCounter, this);
            timer.start();
        
            $.getJSON('src/core/texts.json', function (data) {
                sakot = data.letters[0].content;
            });
        
             $.getJSON('src/core/texts.json', function (data) {
                    output = data.order[Math.floor(Math.random() * data.order.length)].content;
                });
            

        },

    /*
    * sekuntimittari
    */
        updateCounter: function () {
            counter++;
        
         //   console.log(counter);
            if (counter < 5) {
                scoreText.setText(counter);
            } else {
                var tilaus = $.getJSON('src/core/texts.json', function (data) {
                    output = data.order[Math.floor(Math.random() * data.order.length)].content;
                });
                Brew.gui.newOrder(output)
 
                 var list = [];
                list[i] = tilaus;
                i++;
                if (list.length > 3) {
                    Brew.gui.alert(sakot);
                    timer.pause();
                }
                console.log(list.length);
                counter = 0;
            }
        },
        
        update: function () {
    //   if ( this.game.input.activePointer.isDown ) {
    //       Brew.gui.alert('Tämä on <span style="color: red">TESTI</span>!');
    //   }
        
            if (image.input.pointerDown(this.game.input.activePointer.id)) {    
                       Brew.gui.alert("klikkasit kirjettä");
                   }
                   
        //check mouse position and put the cursor on the correct place:
        var _pos = new Phaser.Plugin.Isometric.Point3();
        this.game.iso.unproject(this.game.input.activePointer.position, _pos);
        
        this.isoGroup.forEach(function(tile) {
            var inBounds = tile.isoBounds.containsXY(_pos.x, _pos.y);
            if(inBounds) {
                this.cursor.isoX = tile.isoX;
                this.cursor.isoY = tile.isoY;
            }
            
        }, this);
    },
    
    
    /**
     * Creates the ground of play area.
     * 
     * @private
     */
    __makeFloor: function () {
        var tile;
        for (var xx = 0; xx < 15 * settings.tileSize; xx += settings.tileSize) {
            for (var yy = 0; yy < 15 * settings.tileSize; yy += settings.tileSize) {
                tile = this.add.isoSprite(xx, yy, 0, 'floor', 0, this.isoGroup);
                //tile.anchor.set(0.5, 0.5);
            }
        }
    }
};
    
})();