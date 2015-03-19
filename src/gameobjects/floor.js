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
 [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //kettle
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //kettle
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
    var easystar = new EasyStar.js();
    var intervals = {};
    easystar.setIterationsPerCalculation(10);
    var finished = true;

    var Floor = function () {
        this.grid = easystar.setGrid(graph);
        easystar.setAcceptableTiles([1]);
        this.Person = Brew.Person;
        this.everybodyAreStillAndCalmDown = finished;
        //    this.graph = new Graph(graph1);
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
    Floor.prototype.move = function (person, destination) {
        if (finished == false || person == undefined) {
            return;
        }
        //    this.Person = person;
        this.destination = destination;

        var width = 0;
        /*        if (destination instanceof Brew.Kettle.constructor) {
                    width = Math.floor(this.destination.width / settings.tileSize);
                }
          */
        var start = [Math.floor(person.isoX / settings.tileSize), Math.floor(person.isoY / settings.tileSize)];
        var end = [Math.floor(this.destination.isoX / settings.tileSize), Math.floor(this.destination.isoY / settings.tileSize)];
  //      alert(start + " " + end);
        easystar.findPath(start[0], start[1], end[0], end[1], function (path) {
            if (path === null) {
                alert("Path was not found.");
            } else {
                finished = false;
                var id = setInterval(function () {
                    //path[0].x on kokonaislukuja taulukossa
                    person.isoX = (path[0].x) * settings.tileSize;
                    person.isoY = (path[0].y) * settings.tileSize;

                    Brew.game.add.tween(Brew.Person).to({
                        isoX: person.isoX,
                        isoY: person.isoY,
                        isoZ: 0
                    }, 5, Phaser.Easing.Linear.None, false, 0, 0, false);
                    path.splice(0, 1);

                    if (path.length == 0) {
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