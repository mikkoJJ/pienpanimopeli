(function() {
    
    var settings = {
        //the div under which windows are placed:
        dom: '#game',
        messagesAnimationSpeed: 100,
        messagesHoverSpeed: 100
    };
    
    
    /**
     * The GUI object handles creating UI windows to show to the user. These are created as 
     * HTML DOM elements shown on top of the actual game.
     *
     * @class Brew.GUI
     */
    var GUI = function() {
        this._messageWindow = $('<div><div/>')
            .addClass('brew-messages')
            .appendTo(settings.dom)
        ;
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
       $('<div><div/>')
            .addClass('brew-window brew-alert')
            .html(message)
            .append(this.__makeButton('OK', function() {
                var p = $(this).parent();
                if( p.data('callback') ) p.data('callback').call(p.data('callbackCtx'));
                p.hide('drop', 200, 'easeInBack', function() { this.remove(); });
            }))
            .appendTo(settings.dom)
            .show('drop', 200, 'easeOutBack')
            .data('callback', callback)
            .data('callbackCtx', callbackCtx)
        ;
    };
    
    
    /**
     * Adds a message to the message display.
     * 
     * @param {String} header a header for the message
     * @param {String} message the message content
     * @param {Function} buttonCallback callback to call when button pressed.
     * @param {String} buttonText text to show on a button on the message, null to have no button
     * @param {Brew.Order|Object} data message data to use.
     * @param {Object} buttonCallbackCtx context in which to call the button callback
     */
    GUI.prototype.addMessage = function( header, message, data, buttonText, buttonCallback, buttonCallbackCtx ) {
        var _w = $('<div><div/>')
            .addClass('brew-window brew-message')
            .html('<h2>' + header + '<h2>')
            .append($('<div><div/>')
                        .addClass('brew-message-body brew-window')
                        .html(message)
            )
            .click(this.__messageWindowClicked)
            .hover(this.__messageWindowHover, this.__messageWindowHover) 
            .data('messageData', data)
            .appendTo(this._messageWindow)
            ;
        
        if ( buttonText ) {
            _w.append(
                this.__makeButton(buttonText, function(e) {
                    var $this = $(this);
                    var remove = true;
                
                    if ( $this.data('callback') ) remove = $this.data('callback').call($this.data('callbackCtx'), $this.parent().data('messageData'));

                    if ( remove !== false ) $this.parent().hide('fold', 200, 'easeInBack', function() { $(this).remove(); });
                    else e.stopPropagation();
                })
                .css({display: 'none'})
                .data('callback', buttonCallback)
                .data('callbackCtx', buttonCallbackCtx)
            );
        }
    };

    
    /**
     * Show/hide the messages display.
     */
    GUI.prototype.toggleMessages = function() {
        this.__closeOpenMessages();
        this._messageWindow.toggle('slide', {easing: 'easeOutBounce'}, 200);
    };
    

    /** Makes a DOM 'OK'-button to be added into windows.  @private */
    GUI.prototype.__makeButton = function(text, callback) {
        return $('<div></div>')
            .addClass('brew-button')
            .addClass('jotain')
            .text(text)
            .click(callback)
        ;
    };
    
    
    /** @private */
    GUI.prototype.__messageWindowHover = function() {
        $(this).toggleClass('brew-message-extended', settings.messagesHoverSpeed);
    };
    
    
    /** @private */
    GUI.prototype.__closeOpenMessages = function() {
        $('.brew-message-open').each(function() { 
            $(this).toggleClass('brew-message-open', settings.messagesAnimationSpeed, 'easeOutBounce');
            $(this).children('.brew-message-body, .brew-button').toggle('fold', {direction: 'up', easing: 'easeOutQuad'}, settings.messagesAnimationSpeed);
        });
    };
    
    
    /** @private */
    GUI.prototype.__messageWindowClicked = function() {
        var $this = $(this);
        
        if( !$this.hasClass('brew-message-open') ) {
            $('.brew-message-open').each(function() { 
                $(this).toggleClass('brew-message-open', settings.messagesAnimationSpeed, 'easeOutBounce');
                $(this).children('.brew-message-body, .brew-button').toggle('fold', {direction: 'up', easing: 'easeOutQuad'}, settings.messagesAnimationSpeed);
            });
        }
        
        $this.toggleClass('brew-message-open', settings.messagesAnimationSpeed, 'easeOutBounce');
        $this.children('.brew-message-body, .brew-button').toggle('fold', {direction: 'up', easing: 'easeOutQuad'}, settings.messagesAnimationSpeed);
    };
    
    
    
    Brew.GUI = GUI;
})();