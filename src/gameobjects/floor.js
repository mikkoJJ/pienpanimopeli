(function () {

    var settings = {
        tileSize: 38
    };

    //1 is free space
    //paikka 0,0 on pelilaudan ylin kohta, oikeanpuolimmaisin kulma on 9,0 

    var graph = [
 [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //bases
 [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
 [0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //kettle
 [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //kettle
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
    var easystar = new EasyStar.js();
    var intervals = {};
    easystar.setIterationsPerCalculation(10);

    var Floor = function () {
        this.grid = easystar.setGrid(graph);
        easystar.setAcceptableTiles([1]);
        
        this.person = Brew.person;
        this.destination = null;
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
                tile.inputEnabled = true;
                tile.events.onInputDown.add(this.move, this, {
                    param1: tile
                });
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

    /* Calculates if there is free path to
     * @param {person} who is moving
     * @param {destiny} currently, only tile is possible
     */
    Floor.prototype.move = function (destination) {
        var person = this.person;
        this.destination = destination;
        if (person == undefined || person.moving == true) {
            return;
        }
        
        var start = [Math.floor(person.isoX / settings.tileSize), Math.floor(person.isoY / settings.tileSize)];
        var end = [Math.floor(this.destination.isoX / settings.tileSize), Math.floor(this.destination.isoY / settings.tileSize)];
        //        alert(start + " " + end);
        easystar.findPath(start[0], start[1], end[0], end[1], function (path) {
            if (path === null) {
                alert("Path was not found.");
            } else {
                person.moving = true;
                var id = setInterval(function () {
                    person.isoX = (path[0].x) * settings.tileSize;
                    person.isoY = (path[0].y) * settings.tileSize;

                    path.splice(0, 1);

                    if (path.length == 0) {
                        person.moving = false;
                        finished = true;
                        delete intervals[id];
                        clearInterval(id);
                        // callback();
                    }

                }, 500);
                intervals[id] = true;
            }
        });

        graph[start[0]][start[1]] = 0;
        graph[end[0]][end[1]] = 1;
        this.grid = easystar.setGrid(graph);

    };

    //the actual object moving
    Floor.prototype.update = function () {
        easystar.calculate();
    };

    Brew.Floor = Floor;
})();