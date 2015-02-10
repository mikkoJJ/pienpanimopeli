# pienpanimopeli

A newsgame prototype about managing small breweries in Finland. 

You can play the current deployed version of the game at [mikkojakonen.net/pienpanimo](http://mikkojakonen.net/pienpanimo)

Code released under the MIT Licence. See [LICENSE](/LICENSE).

## Structure

The game js modules are contained in the `src/` folder.

External libraries are contained in the `libs/` folder.

Assets (graphics, sounds and text content) are contained in the `assets/` folder and loaded in the `Preloader` state.
    
### States

* `Booter` *src/core/boot.js* - The Booter state loads all assets used by the `Preloader`. The game starts from the Booter state.
* `Preloader` *src/core/preload.js* - The Preloader state handles loading all of the game's assets from the server onto the client browser so that it's ready to be used.
* `Main` *src/core/main.js* - The main state handles basic gameplay

### Deployment

The `deploy/` folder contains a version of the game that's ready to be deployed on a web server. In practice, the main game modules in `src/` have been minified into one JS file for better performance.