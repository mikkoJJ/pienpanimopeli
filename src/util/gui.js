(function() {
    
    var settings = {
        //the div under which windows are placed:
        dom: '#game',
    };
    
    
    
    /**
     * The GUI object handles creating UI windows to show to the user. These are created as 
     * HTML DOM elements shown on top of the actual game.
     *
     * @class Brew.GUI
     */
    var GUI = function() {
        this._guiInUse = false;
    };
    
    
    /**
     * Show an alert window. It is a simple window with a message and an OK button
     * to dismiss the message.
     * 
     * @param   {String}   message     the message to show
     * @param   {Function} callback    a callback function to call when the message has been dismissed
     * @param   {Object}   callbackCtx the context in which to call the callback function, ie. what 'this' will refer to
     */
    GUI.prototype.alert = function(message, callback, callbackCtx) {
        var _w = $('<div><div/>')
            .addClass('brew-window')
            .html(message)
            .append(this.__makeButton('OK', function() {
                var p = $(this).parent();
                if( p.data('callback') ) p.data('callback').call(p.data('callbackCtx'));
                p.hide('drop', 200, 'easeInBack', function() { this.remove() });
            }))
            .appendTo(settings.dom)
            .show('drop', 200, 'easeOutBack')
            .data('callback', callback)
            .data('callbackCtx', callbackCtx)
        ;
    };
    

    /**
     * Makes a DOM 'OK'-button to be added into windows.
     * 
     * @private
     */
    GUI.prototype.__makeButton = function(text, callback, callbackCtx) {
        return $('<div></div>')
            .addClass('brew-button')
            .addClass('jotain')
            .text(text)
            .click(callback)
        ;
    };
    
    
    Brew.GUI = GUI;
    Brew.gui = new GUI();
})();