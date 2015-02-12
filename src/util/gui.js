(function() {
    
    var settings = {
        //the div under which windows are placed:
        dom: '#game',
        
        //CSS style for alert windows:
        alertStyle: {
            font: '20pt',
            background: 'white',
            width: '400px',
            padding: '10px',
            border: '#20c55f 3px solid',
            margin: 'auto',
            position: 'relative',
            top: '-360px',
            display: 'none'
        },
        
        //CSS style for buttons
        buttonStyle: {
            font: '20pt ',
            width: '50px',
            margin: 'auto',
            background: '#20c55f',
            'text-align': 'center',
            color: 'white',
            cursor: 'pointer'
        }
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
        
        //only allow one alert at a time
        if( this._guiInUse ) return;
        this._guiInUse = true;
        
        //create the DOM element and show it with an animation:
        this._currentWindow = $('<div><div/>')
            .css(settings.alertStyle)
            .html(message)
            .append(this.__makeButton('OK', this.__okPressed, this))
            .appendTo(settings.dom)
            .show('bounce', { times: 3 })
        ;
        
        this._okCallback = callback;
        this._okCallbackCtx = callbackCtx;
    };    
      

    /**
     * Makes a DOM 'OK'-button to be added into windows.
     * 
     * @private
     */
    GUI.prototype.__makeButton = function(text, callback, callbackCtx) {
        return $('<div></div>')
            .css(settings.buttonStyle)
            .text(text)
            .click($.proxy(callback, callbackCtx))
        ;
    };
    
    
    /**
     * A function to return to when the user has clicked OK in an alert
     * window.
     * 
     * @private
     */
    GUI.prototype.__okPressed = function() {
        this._currentWindow.hide('puff', { percent: 110 }, 'fast');
        this._guiInUse = false;
        if( this._okCallback ) this._okCallback.call(this._okCallbackCtx);    
    };
    
    
    Brew.GUI = GUI;
    Brew.gui = new GUI();
})();