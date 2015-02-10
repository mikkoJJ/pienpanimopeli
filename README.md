# pienpanimopeli

A newsgame prototype about managing small breweries in Finland.

## Structure

### States

* `Booter` (src/core/boot.js) - The Booter state loads all assets used by the `Preloader`. The game starts from the Booter state.
* `Preloader` (src/core/preload.js) - The Preloader state handles loading all of the game's assets from the server onto the client browser so that it's ready to be used.
* `Main` (src/core/main.js) - The main state handles basic gameplay