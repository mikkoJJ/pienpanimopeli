(function () {

    var settings = {
        tileSize: 38
    };

    //1 is free space
    //paikka 0,0 on pelilaudan ylin kohta, oikeanpuolimmaisin kulma on 9,0 

    var graph = [
 //beer storage  //resource storage       
 [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
 [0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
 [1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
 [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
 [0, 0, 1, 1, 1, 1, 1, 0, 0, 1], //fermenter
 [1, 1, 1, 1, 1, 1, 1, 0, 0, 1], //fermenter
 [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
 [0, 0, 1, 1, 1, 1, 1, 0, 0, 1], //lauterer
 [1, 1, 1, 1, 0, 0, 0, 0, 0, 1], //lauterer
 [0, 0, 1, 1, 0, 0, 0, 1, 1, 1]
];
 
    var Floor = function () {
        
    };

    /**
     * Creates the ground of play area.
     *
     * @private
     */
    Floor.prototype.makeFloor = function (game, isoGroup) {
        var tile;
        for (var xx = 0; xx < 10 * settings.tileSize; xx += settings.tileSize) {
            for (var yy = 0; yy < 10 * settings.tileSize; yy += settings.tileSize) {
                tile = game.add.isoSprite(xx, yy, 0, 'sprites', 'floor', isoGroup);
                tile.anchor.set(0.5, 0.5);
            }
        }
    };
    /* for stuff placement
     * @param {element}
     */
    Floor.prototype.setElement = function (element) {
        //   alert(Math.floor(element.isoX / settings.tileSize));
        graph[Math.floor(element.isoX / settings.tileSize)][Math.floor(element.isoY / settings.tileSize)] = 0;
        this.grid = easystar.setGrid(graph);
    };


    Brew.Floor = Floor;
})();