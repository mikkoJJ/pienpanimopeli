(function () {

    var settings = {
        tileSize: 38
    };

    //1 is free space
    //paikka 0,0 on pelilaudan ylin kohta, oikeanpuolimmaisin kulma on 9,0 

    var graph = [
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
 [1, 0, 0, 1, 1, 1, 1, 1, 1, 1], //bases
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 0, 0, 1], //kettle
 [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 0, 0, 1], //kettle
 [1, 1, 1, 1, 1, 1, 1, 0, 0, 1] 
];
    var easystar = new EasyStar.js();
    var intervals = {};
    easystar.setIterationsPerCalculation(10);

    var Floor = function () {
        this.grid = easystar.setGrid(graph);
        easystar.setAcceptableTiles([1]);
        this.Person = Brew.Person;
        //    this.graph = new Graph(graph1);
    };

    /* for stuff placement
     * @param {element}
     */
    Floor.prototype.setElement = function (element) {
        //   alert(Math.floor(element.isoX / settings.tileSize));
        //  graph[Math.floor(element.isoX / settings.tileSize)][Math.floor(element.isoY / settings.tileSize)] = 0;
    };

    /* Calculates if there is free path to
     * @param {person} who is moving
     * @param {destiny} currently, only tile is possible
     */
    Floor.prototype.move = function (person, destination) {
        this.Person = person;
        this.destination = destination;

        var width = 0;
        /*        if (destination instanceof Brew.Kettle.constructor) {
                    width = Math.floor(this.destination.width / settings.tileSize);
                }
          */
        var start = [Math.floor(this.Person.isoX / settings.tileSize), Math.floor(this.Person.isoY / settings.tileSize)];
        var end = [Math.floor(this.destination.isoX / settings.tileSize), Math.floor(this.destination.isoY / settings.tileSize + width)];
        //    alert(start + " " + end);
        easystar.findPath(start[0], start[1], end[0], end[1], function (path) {
            if (path === null) {
                alert("Path was not found.");
            } else {
                var id = setInterval(function () {
                    //path[0].x on kokonaislukuja taulukossa
                    Brew.Person.isoX = (path[0].x - 1) * settings.tileSize;
                    Brew.Person.isoY = (path[0].y - 1) * settings.tileSize;
                    //+1 koska tulkitsee jostain syystä ylimmän rivin -1:seksi, mutta heittää eka siirron yhden kauemmas

                    Brew.game.add.tween(Brew.Person).to({
                        isoX: Brew.Person.isoX,
                        isoY: Brew.Person.isoY,
                        isoZ: 0
                    }, 1000, Phaser.Easing.Linear.None, false, 0, 0, false);
                    path.splice(0, 1);

                    if (path.length == 0) {
                        //  delete intervals[id];
                        clearInterval(id);
                        // callback();
                    }

                }, 1000);
                //    intervals[id] = true;

            }
     
        });

        graph[start[0]][start[1]] = 0;
        graph[end[0]][end[1]] = 1;

    };

    //the actual object moving
    Floor.prototype.update = function () {
        easystar.calculate();
    };

    Brew.Floor = Floor;
})();