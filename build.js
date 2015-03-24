/**
 * Build script for Pienpanimopeli. Copies a deployable version of the game to deploy/
 * 
 * @author Mikko J Jakonen
 * @version 1.1 (28.2.2015)
 */
var OUTPUT_FILE = 'js/pienpanimopeli.min.js',
    COPIED_FILES = [
        'brewgui.css',
        'assets',
        'lib'
    ]
    ;

var compressor = require('node-minify'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    date = new Date(),
    dateString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    ;

//1: ------------------- copy copied files:
for( var i = 0; i < COPIED_FILES.length; i++ ) {
    ncp(COPIED_FILES[i], 'deploy/' + COPIED_FILES[i], { filter: /^((?!single_sprites).)*$/ }, function(err) {
        if(err) return console.log(err);
        
        console.log('File/dir copied');
    });
}


//2: --------------------- read js module info from index.html
fs.readFile('index.html', 'utf8', function(err, data) {
    if(err) {
        return console.log(err);
    }
    
    var input_files = data.match(/(src\/[^"]+)/g);    
    
    //3: ---------------------- minify modules from src/:
    new compressor.minify({
        type: 'uglifyjs',
        fileIn: input_files,
        fileOut: 'deploy/' + OUTPUT_FILE,
        callback: function(err, min) {
            if(err) return console.log(err);
            console.log('Minified JS modules.');
        }
    });
    
    //4: ---------------------- write index.html
    var result = data.replace(/<!-- MODULES -->[\s\S]*?<!-- \/MODULES -->/gm, '<script src="' + OUTPUT_FILE + '"></script>');
    result = result.replace(/<!-- VERSION -->/g, dateString);
        
    fs.writeFile('deploy/index.html', result, 'utf8', function(err) {
        if(err) return console.log(err);
    });
    console.log('index.html written.');
});



