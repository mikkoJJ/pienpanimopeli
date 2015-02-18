# Application structure and plan document

This document describes the top level structure and application development decisions of the Pienpanimopeli.

## Folder structure

The game js modules are contained in the `src/` folder.

External libraries are contained in the `libs/` folder.

Assets (graphics, sounds and text content) are contained in the `assets/` folder and loaded in the `Preloader` state.

Documentation and other files humans may find useful are in the `docs/` folder.

A minifiead and ready-to-upload version of the project is contained in the `deploy/` folder.

## External libraries

The external libraries required by the game are:

* [Phaser v2.2.2](http://phaser.io)
* [Phaser Isometric Plugin (20.8.2014)](http://rotates.org/phaser/iso/)
* [jQuery v2.3.1](http://jquery.com)
* [jQuery UI v1.11.2](http://jqueryui.com)

## The main `Brew` namespace

All objects related to the game are defined under the `Brew` namespace to lessen the risk of naming clashes with external libraries and other scripts that might be running on the page where the game is displayed.
    
## States

Game activities are divided into states (derived from `Phaser.State`) to properly structure the game application. The different game states are:

* `Brew.Booter` *src/core/boot.js* - The Booter state loads all assets used by the `Preloader`. The game starts from the Booter state.
* `Brew.Preloader` *src/core/preload.js* - The Preloader state handles loading all of the game's assets from the server onto the client browser so that it's ready to be used.
* `Brew.Main` *src/core/main.js* - The main state handles basic gameplay.
* `Brew.MainMenu` *src/core/menu.js* - Shows the starting splash screen, options for starting the game and shows credits.

## Other modules

* `Brew.gui` *src/util/gui.js* - A singleton object that handles drawing the various GUI windows and forms presented to the user. Uses `jQuery` to render HTML DOM elements on top of the game `<canvas>`. DOM elements allow more robust options for formatting text than Phaser game objects.
* `Brew.Model` *src/model* - A collection of objects that handle the logic behind simulating the process of brewin beer. The simulation is not especially robust but is grounded in reality. These objects are then referenced and updated in `Brew.Main`.

## Coding aestethics

Namespaces and class names are `Capitalized`. Object names, public members and helper variables are in `lowercase`. Private members of objects are named with two preceding `__underscores`, and should not be called from outside the class. Constants are named in `UPPERCASE`. 

The contents of each javascript file should be wrapped inside a lambda function and then where applicable made public by adding to the `Brew` namespace. For example:

```javascript
(function() {

//the contents
var hidden;

var shown = { };
Brew.shown = shown;

})();
```

## Deployment

The `build.js` script is used to create a web server deployable version of the project. It minifies the modules from `src/` into a single JS file and copies it and other relevant files into `deploy/`. The contents of the `deploy/` folder can then be uploaded onto a web server. Our test version is located [here](http://mikkojakonen.net/pienpanimo).

To use the build script, install NodeJS and the modules `node-minify` and `ncp`, then call
```
node build.js
```