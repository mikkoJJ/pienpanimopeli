/**
 * Build script for Pienpanimopeli. Copies a deployable version of the game to deploy/
 * 
 * @author Mikko J Jakonen
 * @version 1.0 (12.2.2015)
 */
var compressor = require('node-minify'),
    fs = require('fs'),
    ncp = require('ncp').ncp;
    ;

var date = new Date();
var dateString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();


//straight up copy assets and libs:
ncp('assets', 'deploy/assets', function(err) {
    if(err) {
        return console.log(err);
    }
    
    console.log('Copied assets.');
});

ncp('lib', 'deploy/lib', function(err) {
    if(err) {
        return console.log(err);
    }
    
    console.log('Copied lib.');
});

//minify modules from src/:
new compressor.minify({
    type: 'uglifyjs',
    fileIn: [
        'src/core/brew.js',
        'src/core/boot.js',
        'src/core/preload.js',
        'src/core/main.js',
    ],
    fileOut: 'deploy/js/pienpanimopeli.min.js',
    callback: function(err, min) {
        if(err) return console.log(err);
        console.log('Minified JS modules.');
    }
});


//copy index.html and insert reference to the minified file:
fs.readFile('index.html', 'utf8', function(err, data) {
    if(err) {
        return console.log(err);
    }
    
    var result = data.replace(/<!-- MODULES -->[\s\S]*?<!-- \/MODULES -->/gm, '<script src="js/pienpanimopeli.min.js"></script>');
    result = result.replace(/<!-- VERSION -->/g, dateString);
        
        
    fs.writeFile('deploy/index.html', result, 'utf8', function(err) {
        if(err) return console.log(err);
    });
    
    console.log('index.html written.');
});